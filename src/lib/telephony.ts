import crypto from 'crypto';
import { getDb } from './db';
import { normalizeIndianPhoneNumber } from './utils';

export interface NormalizedTelephonyEvent {
  eventId: string;
  provider: 'mock_sandbox' | 'exotel' | 'twilio';
  callId: string;
  direction: 'incoming' | 'outgoing';
  fromNumber: string;
  toNumber: string;
  status: 'completed' | 'busy' | 'no_answer' | 'failed' | 'in_progress';
  durationSeconds: number;
  agentId?: string;
  recordingUrl?: string;
  timestamp: string;
  rawPayload: Record<string, unknown>;
}

export interface TelephonyResult {
  success: boolean;
  duplicate: boolean;
  callLogId?: string;
  contactId?: string;
  message: string;
}

/**
 * Verify HMAC-SHA256 signature from telephony provider
 */
export function verifyTelephonySignature(
  payloadString: string,
  providedSignature: string | null | undefined,
  secret: string
): boolean {
  if (!providedSignature || !secret) return false;
  try {
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
    
    // Constant time comparison to prevent timing attacks
    if (computedSignature.length !== providedSignature.length) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(providedSignature));
  } catch {
    return false;
  }
}

/**
 * Process normalized telephony webhook event idempotently
 */
export function processTelephonyWebhook(
  event: NormalizedTelephonyEvent,
  signatureValid: boolean
): TelephonyResult {
  const db = getDb();
  const now = new Date().toISOString();

  // 1. Idempotency Check: Have we seen this eventId before?
  const existingEvent = db.prepare('SELECT id, processed FROM webhook_events WHERE event_id = ?').get(event.eventId) as
    | { id: string; processed: number }
    | undefined;

  if (existingEvent) {
    return {
      success: true,
      duplicate: true,
      message: `Event ${event.eventId} already processed (idempotency key matched).`,
    };
  }

  // 2. Record raw webhook in webhook_events
  const webhookRecordId = `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  db.prepare(`
    INSERT INTO webhook_events (id, provider, event_id, event_type, payload, signature_verified, processed, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, ?)
  `).run(
    webhookRecordId,
    event.provider,
    event.eventId,
    event.status,
    JSON.stringify(event.rawPayload),
    signatureValid ? 1 : 0,
    now
  );

  // If signature verification failed, do not mutate core CRM data
  if (!signatureValid) {
    db.prepare('UPDATE webhook_events SET error_message = ? WHERE id = ?').run(
      'Rejected due to invalid HMAC signature',
      webhookRecordId
    );
    return {
      success: false,
      duplicate: false,
      message: 'Invalid webhook signature. Event logged for security audit.',
    };
  }

  // 3. Find or create matching contact based on Normalized Indian Phone
  const callerNumber = event.direction === 'incoming' ? event.fromNumber : event.toNumber;
  const normalizedPhoneInfo = normalizeIndianPhoneNumber(callerNumber);
  
  let contactId: string | null = null;
  if (normalizedPhoneInfo.isValid) {
    const matchedContact = db
      .prepare('SELECT id, parent_name FROM contacts WHERE normalized_phone = ? AND is_archived = 0 LIMIT 1')
      .get(normalizedPhoneInfo.normalized) as { id: string; parent_name: string } | undefined;

    if (matchedContact) {
      contactId = matchedContact.id;
    } else {
      // Create new inbound phone enquiry contact
      contactId = `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      db.prepare(`
        INSERT INTO contacts (
          id, parent_name, student_name, primary_phone, normalized_phone,
          course_interest, source, status, notes, consent_given, is_archived, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?)
      `).run(
        contactId,
        `Phone Caller (${normalizedPhoneInfo.formattedDisplay})`,
        null,
        callerNumber,
        normalizedPhoneInfo.normalized,
        'Undecided / Telephony Inbound',
        'phone',
        event.status === 'completed' ? 'connected' : 'contact_attempted',
        `Auto-created from verified inbound call on ${event.timestamp}`,
        now,
        now
      );
    }
  }

  // 4. Map Telephony Provider Status to CRM Call Outcome
  let mappedOutcome: 'connected' | 'no_answer' | 'busy' | 'switched_off' | 'wrong_number' | 'callback_required' | 'other' = 'other';
  if (event.status === 'completed') {
    mappedOutcome = 'connected';
  } else if (event.status === 'no_answer') {
    mappedOutcome = 'no_answer';
  } else if (event.status === 'busy') {
    mappedOutcome = 'busy';
  }

  // 5. Insert call log with strict PROVIDER_VERIFIED provenance
  const callLogId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const staffId = event.agentId || 'usr_staff_01';

  db.prepare(`
    INSERT INTO call_logs (
      id, contact_id, direction, started_at, duration_seconds,
      staff_id, provider_call_id, outcome, notes, follow_up_needed,
      created_by, created_at, source, provenance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'telephony_webhook', 'provider_verified')
  `).run(
    callLogId,
    contactId,
    event.direction,
    event.timestamp,
    event.durationSeconds,
    staffId,
    event.callId,
    mappedOutcome,
    `Telephony provider webhook: Status=${event.status}, Duration=${event.durationSeconds}s. Provider: ${event.provider}`,
    mappedOutcome !== 'connected' ? 1 : 0,
    `telephony_${event.provider}`,
    now
  );

  // If call was missed or unanswered, auto-schedule follow-up task
  if (contactId && mappedOutcome !== 'connected') {
    const followUpId = `flw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    // Due 2 hours from now during working hours
    const dueDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO follow_ups (
        id, contact_id, assigned_to, due_at, timezone, status, priority, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'Asia/Kolkata', 'pending', 'high', ?, ?, ?)
    `).run(
      followUpId,
      contactId,
      staffId,
      dueDate,
      `Automatic follow-up: Missed/Unanswered call from ${callerNumber} at ${event.timestamp}`,
      now,
      now
    );
  }

  // Mark webhook event as processed
  db.prepare('UPDATE webhook_events SET processed = 1 WHERE id = ?').run(webhookRecordId);

  return {
    success: true,
    duplicate: false,
    callLogId,
    contactId: contactId || undefined,
    message: `Call log recorded with provider verification. Outcome: ${mappedOutcome}.`,
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import {
  processTelephonyWebhook,
  verifyTelephonySignature,
  NormalizedTelephonyEvent,
} from '@/lib/telephony';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      // In case form urlencoded
      return NextResponse.json({ success: false, error: 'JSON payload expected' }, { status: 400 });
    }

    const signature = req.headers.get('x-telephony-signature') || req.headers.get('x-exotel-signature');
    const db = getDb();
    const telSettings = db.prepare('SELECT webhook_secret FROM telephony_settings WHERE id = ?').get('default') as
      | { webhook_secret: string }
      | undefined;

    const secret = telSettings?.webhook_secret || 'ks_webhook_secret_demo_2026';
    const isSignatureValid = verifyTelephonySignature(rawBody, signature, secret);

    // Normalize incoming payload based on structure
    const eventId = (body.eventId || body.CallSid || body.call_id || `evt_${Date.now()}`) as string;
    const callId = (body.callId || body.CallSid || body.call_id || `call_${Date.now()}`) as string;
    const direction = ((body.direction || (body.Direction === 'inbound' ? 'incoming' : 'outgoing')) as 'incoming' | 'outgoing') || 'incoming';
    const fromNumber = (body.fromNumber || body.From || body.from || '+919443718847') as string;
    const toNumber = (body.toNumber || body.To || body.to || '+919443718847') as string;
    
    // Status normalization
    let status: 'completed' | 'busy' | 'no_answer' | 'failed' | 'in_progress' = 'completed';
    const rawStatus = String(body.status || body.CallStatus || body.Status || '').toLowerCase();
    if (rawStatus.includes('no-answer') || rawStatus.includes('no_answer')) status = 'no_answer';
    else if (rawStatus.includes('busy')) status = 'busy';
    else if (rawStatus.includes('fail')) status = 'failed';
    else if (rawStatus.includes('progress')) status = 'in_progress';
    else status = 'completed';

    const duration = parseInt(String(body.durationSeconds || body.CallDuration || body.duration || 0), 10);

    const event: NormalizedTelephonyEvent = {
      eventId,
      provider: (body.provider as 'mock_sandbox' | 'exotel' | 'twilio') || 'mock_sandbox',
      callId,
      direction,
      fromNumber,
      toNumber,
      status,
      durationSeconds: duration,
      agentId: (body.agentId || body.agent_id) as string | undefined,
      timestamp: (body.timestamp as string) || new Date().toISOString(),
      rawPayload: body,
    };

    const result = processTelephonyWebhook(event, isSignatureValid);

    if (!result.success && !result.duplicate) {
      return NextResponse.json({ success: false, error: result.message }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      duplicate: result.duplicate,
      callLogId: result.callLogId,
      contactId: result.contactId,
      message: result.message,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Webhook processing error' }, { status: 500 });
  }
}

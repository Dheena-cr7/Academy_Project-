import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { scenario, fromPhone, duration, tamperSignature, duplicateEventId } = await req.json();

    const db = getDb();
    const telSettings = db.prepare('SELECT webhook_secret FROM telephony_settings WHERE id = ?').get('default') as
      | { webhook_secret: string }
      | undefined;

    const secret = telSettings?.webhook_secret || 'ks_webhook_secret_demo_2026';
    const timestamp = new Date().toISOString();

    const eventId = duplicateEventId || `sim_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const callId = `sim_call_${Date.now()}`;

    let status = 'completed';
    let durationSeconds = duration || 142;

    if (scenario === 'missed_call') {
      status = 'no_answer';
      durationSeconds = 0;
    } else if (scenario === 'busy') {
      status = 'busy';
      durationSeconds = 0;
    }

    const payloadObj = {
      provider: 'mock_sandbox',
      eventId,
      callId,
      direction: 'incoming',
      fromNumber: fromPhone || '+919443718847',
      toNumber: '+919443718847',
      status,
      durationSeconds,
      timestamp,
      notes: `Simulated ${scenario} event`,
    };

    const payloadString = JSON.stringify(payloadObj);

    // Compute signature or tamper it if requested
    let signature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
    if (tamperSignature) {
      signature = 'invalid_forged_signature_12345';
    }

    // Call the local webhook endpoint directly
    const webhookUrl = new URL('/api/telephony/webhook', req.url).toString();
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telephony-signature': signature,
      },
      body: payloadString,
    });

    const responseData = await webhookRes.json();

    return NextResponse.json({
      success: webhookRes.ok,
      httpStatus: webhookRes.status,
      eventId,
      signatureUsed: signature,
      signatureTampered: !!tamperSignature,
      webhookResponse: responseData,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to simulate telephony event' }, { status: 500 });
  }
}

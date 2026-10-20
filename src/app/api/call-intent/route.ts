import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty in some beacon calls
    }

    const sourceContext = (body.sourceContext as string) || 'Website Call CTA';
    const phone = (body.phone as string) || '+91 94437 18847';

    const db = getDb();
    const isoNow = new Date().toISOString();
    const callLogId = generateId('call');

    // Record website click intent with explicit provenance
    db.prepare(`
      INSERT INTO call_logs (
        id, contact_id, direction, started_at, duration_seconds,
        staff_id, outcome, notes, follow_up_needed,
        created_by, created_at, source, provenance
      ) VALUES (?, NULL, 'outgoing', ?, 0, NULL, 'intent_recorded', ?, 0, 'website_visitor', ?, 'website_click', 'website_click_intent')
    `).run(
      callLogId,
      isoNow,
      `Visitor clicked call button: Destination=${phone}, Context=${sourceContext}. (Classified as click-to-call intent, not a confirmed connected phone call).`,
      isoNow
    );

    return NextResponse.json({
      success: true,
      callLogId,
      provenance: 'website_click_intent',
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to record call intent' }, { status: 500 });
  }
}

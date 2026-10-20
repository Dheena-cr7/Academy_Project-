import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { normalizeIndianPhoneNumber, generateId } from '@/lib/utils';

// Simple in-memory rate limiting map for form submissions (5 requests per 10 minutes per IP)
const rateLimitMap = new Map<string, { count: number; firstTime: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);

    if (rateData) {
      if (now - rateData.firstTime < 10 * 60 * 1000) {
        if (rateData.count >= 10) {
          return NextResponse.json(
            { success: false, error: 'Too many submissions. Please wait a few minutes or call us directly.' },
            { status: 429 }
          );
        }
        rateData.count += 1;
      } else {
        rateLimitMap.set(ip, { count: 1, firstTime: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, firstTime: now });
    }

    const body = await req.json();
    const {
      parentName,
      phone,
      studentName,
      courseInterest,
      preferredCallbackWindow,
      message,
      consentGiven,
      sourceUrl,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Validate Parent Name
    if (!parentName || typeof parentName !== 'string' || parentName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Parent/Guardian name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    // Validate Indian Phone Number
    const phoneCheck = normalizeIndianPhoneNumber(phone);
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: phoneCheck.error || 'Please enter a valid 10-digit Indian phone number.' },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { success: false, error: 'Consent to contact regarding admissions is required.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const isoNow = new Date().toISOString();

    // Check for Duplicate or Existing Contact with this Normalized Phone
    const existingContact = db
      .prepare('SELECT id, parent_name, status FROM contacts WHERE normalized_phone = ? AND is_archived = 0 LIMIT 1')
      .get(phoneCheck.normalized) as { id: string; parent_name: string; status: string } | undefined;

    let contactId = existingContact?.id;

    if (existingContact) {
      // Re-inquire / Update existing contact without creating accidental duplicate
      const combinedNote = `[New Website Re-enquiry on ${isoNow}]: Course: ${courseInterest || 'General'}. Callback: ${preferredCallbackWindow || 'Standard'}. Note: ${message || 'None'}.`;
      db.prepare(`
        UPDATE contacts 
        SET 
          course_interest = ?,
          status = 'new',
          notes = CASE WHEN notes IS NULL THEN ? ELSE notes || '\n' || ? END,
          updated_at = ?
        WHERE id = ?
      `).run(courseInterest || 'Sainik School (AISSEE)', combinedNote, combinedNote, isoNow, existingContact.id);

      // Record history entry
      db.prepare(`
        INSERT INTO enquiry_status_history (id, contact_id, old_status, new_status, actor_id, notes, created_at)
        VALUES (?, ?, ?, 'new', 'website_visitor', 'Re-enquiry from website form', ?)
      `).run(generateId('esh'), existingContact.id, existingContact.status, isoNow);
    } else {
      // Create new contact record
      contactId = generateId('cnt');
      const initialNotes = `Initial Website Enquiry:
Course: ${courseInterest || 'Sainik School (AISSEE)'}
Student: ${studentName || 'Not specified'}
Preferred Callback: ${preferredCallbackWindow || 'Standard working hours'}
Message: ${message || 'None'}
Source Page: ${sourceUrl || '/'}`;

      db.prepare(`
        INSERT INTO contacts (
          id, parent_name, student_name, primary_phone, normalized_phone,
          course_interest, source, status, notes, consent_given, is_archived,
          utm_source, utm_medium, utm_campaign, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'website', 'new', ?, 1, 0, ?, ?, ?, ?, ?)
      `).run(
        contactId,
        parentName.trim(),
        studentName ? studentName.trim() : null,
        phoneCheck.formattedDisplay,
        phoneCheck.normalized,
        courseInterest || 'Sainik School (AISSEE)',
        initialNotes,
        utmSource ? String(utmSource).slice(0, 100) : null,
        utmMedium ? String(utmMedium).slice(0, 100) : null,
        utmCampaign ? String(utmCampaign).slice(0, 100) : null,
        isoNow,
        isoNow
      );

      // Record status history
      db.prepare(`
        INSERT INTO enquiry_status_history (id, contact_id, old_status, new_status, actor_id, notes, created_at)
        VALUES (?, ?, NULL, 'new', 'website_visitor', 'Initial website enquiry submitted', ?)
      `).run(generateId('esh'), contactId, isoNow);

      // Automatically create initial follow-up task for counsellors
      const followUpId = generateId('flw');
      // Due within 4 hours
      const dueTime = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
      db.prepare(`
        INSERT INTO follow_ups (
          id, contact_id, assigned_to, due_at, timezone, status, priority, notes, created_at, updated_at
        ) VALUES (?, ?, 'usr_staff_01', ?, 'Asia/Kolkata', 'pending', 'high', ?, ?, ?)
      `).run(
        followUpId,
        contactId,
        dueTime,
        `New website lead from ${parentName.trim()} (${phoneCheck.formattedDisplay}). Course: ${courseInterest || 'Sainik School'}`,
        isoNow,
        isoNow
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your admission enquiry has been safely received. A counsellor will call you shortly.',
      contactId,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: 'Database transaction error. Please call +91 94437 18847 directly.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser, permissions } from '@/lib/auth';
import { generateId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get('entity') || 'all';

  try {
    const db = getDb();

    if (entity === 'announcements') {
      const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
      return NextResponse.json({ success: true, announcements });
    }

    if (entity === 'courses') {
      const courses = db.prepare('SELECT * FROM courses ORDER BY display_order ASC').all();
      return NextResponse.json({ success: true, courses });
    }

    if (entity === 'faculty') {
      const faculty = db.prepare('SELECT * FROM faculty ORDER BY display_order ASC').all();
      return NextResponse.json({ success: true, faculty });
    }

    if (entity === 'results') {
      const results = db.prepare('SELECT * FROM results ORDER BY year DESC, created_at DESC').all();
      return NextResponse.json({ success: true, results });
    }

    if (entity === 'testimonials') {
      const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY display_order ASC, created_at DESC').all();
      return NextResponse.json({ success: true, testimonials });
    }

    if (entity === 'gallery') {
      const gallery = db.prepare('SELECT * FROM gallery_items ORDER BY display_order ASC').all();
      return NextResponse.json({ success: true, gallery });
    }

    if (entity === 'faqs') {
      const faqs = db.prepare('SELECT * FROM faqs ORDER BY display_order ASC').all();
      return NextResponse.json({ success: true, faqs });
    }

    // Return combined snapshot
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
    const courses = db.prepare('SELECT * FROM courses ORDER BY display_order ASC').all();
    const faculty = db.prepare('SELECT * FROM faculty ORDER BY display_order ASC').all();
    const results = db.prepare('SELECT * FROM results ORDER BY year DESC').all();
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY display_order ASC').all();
    const gallery = db.prepare('SELECT * FROM gallery_items ORDER BY display_order ASC').all();
    const faqs = db.prepare('SELECT * FROM faqs ORDER BY display_order ASC').all();

    return NextResponse.json({
      success: true,
      data: { announcements, courses, faculty, results, testimonials, gallery, faqs },
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch CMS content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canEditCms(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { entity, item } = await req.json();
    const db = getDb();
    const now = new Date().toISOString();

    if (entity === 'announcements') {
      const id = item.id || generateId('ann');
      db.prepare(`
        INSERT INTO announcements (id, title, content, badge, link_url, is_active, publish_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, item.title, item.content, item.badge || 'Notice', item.link_url || null, item.is_active ? 1 : 0, now, now);
    } else if (entity === 'results') {
      const id = item.id || generateId('res');
      db.prepare(`
        INSERT INTO results (id, student_name, exam_name, year, rank_or_score, school_allotted, verified_document_ref, is_featured, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `).run(
        id,
        item.student_name,
        item.exam_name,
        item.year,
        item.rank_or_score || null,
        item.school_allotted || null,
        item.verified_document_ref || null,
        item.is_featured ? 1 : 0,
        now
      );
    } else if (entity === 'faqs') {
      const id = item.id || generateId('faq');
      db.prepare(`
        INSERT INTO faqs (id, category, question, answer, display_order, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, 1, ?)
      `).run(id, item.category || 'General', item.question, item.answer, item.display_order || 0, now);
    } else if (entity === 'testimonials') {
      const id = item.id || generateId('tst');
      db.prepare(`
        INSERT INTO testimonials (id, author_name, role_relation, message, year, has_consent, is_featured, is_active, display_order, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(
        id,
        item.author_name,
        item.role_relation,
        item.message,
        item.year || '2025',
        item.has_consent ? 1 : 0,
        item.is_featured ? 1 : 0,
        item.display_order || 0,
        now
      );
    }

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'CMS_CREATE', ?, ?, ?, ?)
    `).run(
      generateId('aud'),
      session.userId,
      session.username,
      entity,
      item.id || 'new',
      `Created new item in ${entity}`,
      now
    );

    return NextResponse.json({ success: true, message: `Created item in ${entity}` });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to create CMS item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = getSessionUser();
  if (!session || !permissions.canEditCms(session.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { entity, item } = await req.json();
    const db = getDb();
    const now = new Date().toISOString();

    if (entity === 'announcements') {
      db.prepare(`
        UPDATE announcements 
        SET title = ?, content = ?, badge = ?, link_url = ?, is_active = ?
        WHERE id = ?
      `).run(item.title, item.content, item.badge, item.link_url, item.is_active ? 1 : 0, item.id);
    } else if (entity === 'courses') {
      db.prepare(`
        UPDATE courses 
        SET title = ?, badge = ?, short_description = ?, full_description = ?, eligibility = ?, age_criteria = ?, exam_pattern = ?, duration = ?, batch_info = ?, is_active = ?, updated_at = ?
        WHERE id = ?
      `).run(
        item.title,
        item.badge,
        item.short_description,
        item.full_description,
        item.eligibility,
        item.age_criteria,
        item.exam_pattern,
        item.duration,
        item.batch_info,
        item.is_active ? 1 : 0,
        now,
        item.id
      );
    } else if (entity === 'results') {
      db.prepare(`
        UPDATE results 
        SET student_name = ?, exam_name = ?, year = ?, rank_or_score = ?, school_allotted = ?, verified_document_ref = ?, is_featured = ?, is_active = ?
        WHERE id = ?
      `).run(
        item.student_name,
        item.exam_name,
        item.year,
        item.rank_or_score,
        item.school_allotted,
        item.verified_document_ref,
        item.is_featured ? 1 : 0,
        item.is_active ? 1 : 0,
        item.id
      );
    } else if (entity === 'faqs') {
      db.prepare(`
        UPDATE faqs 
        SET category = ?, question = ?, answer = ?, display_order = ?, is_active = ?
        WHERE id = ?
      `).run(item.category, item.question, item.answer, item.display_order, item.is_active ? 1 : 0, item.id);
    }

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, ?, ?, 'CMS_UPDATE', ?, ?, ?, ?)
    `).run(
      generateId('aud'),
      session.userId,
      session.username,
      entity,
      item.id,
      `Updated item ${item.id} in ${entity}`,
      now
    );

    return NextResponse.json({ success: true, message: `Updated item in ${entity}` });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to update CMS item' }, { status: 500 });
  }
}

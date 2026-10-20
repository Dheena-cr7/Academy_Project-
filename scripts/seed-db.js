const crypto = require('crypto');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'kalaivani.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('super_admin', 'manager', 'counsellor', 'content_editor', 'auditor')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- Single Source of Truth for Contact and Brand Settings
  CREATE TABLE IF NOT EXISTS contact_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    institution_name TEXT NOT NULL,
    display_phone TEXT NOT NULL,
    international_phone TEXT NOT NULL,
    tel_uri TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    whatsapp_message TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    directions_url TEXT NOT NULL,
    office_hours TEXT NOT NULL,
    emergency_phone TEXT,
    announcement_bar_text TEXT,
    announcement_bar_enabled INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL,
    updated_by TEXT
  );

  -- Contacts (Parents and Students)
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    parent_name TEXT NOT NULL,
    student_name TEXT,
    primary_phone TEXT NOT NULL,
    normalized_phone TEXT NOT NULL,
    alternate_phone TEXT,
    email TEXT,
    course_interest TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('website', 'phone', 'whatsapp', 'referral', 'walk_in', 'other')),
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN (
      'new', 'contact_attempted', 'connected', 'interested',
      'follow_up_scheduled', 'visit_planned', 'admission_confirmed',
      'not_interested', 'not_eligible', 'duplicate', 'invalid_contact', 'closed'
    )),
    assigned_to TEXT,
    notes TEXT,
    consent_given INTEGER NOT NULL DEFAULT 1,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(assigned_to) REFERENCES users(id) ON DELETE SET NULL
  );

  -- Call Logs with strictly tracked provenance
  CREATE TABLE IF NOT EXISTS call_logs (
    id TEXT PRIMARY KEY,
    contact_id TEXT,
    direction TEXT NOT NULL CHECK(direction IN ('incoming', 'outgoing')),
    started_at TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    staff_id TEXT,
    provider_call_id TEXT,
    outcome TEXT NOT NULL CHECK(outcome IN (
      'connected', 'no_answer', 'busy', 'switched_off',
      'wrong_number', 'callback_required', 'info_provided',
      'not_interested', 'intent_recorded', 'other'
    )),
    notes TEXT,
    follow_up_needed INTEGER NOT NULL DEFAULT 0,
    follow_up_at TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('manual_entry', 'website_click', 'telephony_webhook')),
    provenance TEXT NOT NULL CHECK(provenance IN ('staff_reported', 'website_click_intent', 'provider_verified')),
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY(staff_id) REFERENCES users(id) ON DELETE SET NULL
  );

  -- Follow-ups Workflow
  CREATE TABLE IF NOT EXISTS follow_ups (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL,
    assigned_to TEXT,
    due_at TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'rescheduled', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('normal', 'high', 'urgent')),
    notes TEXT,
    completed_at TEXT,
    completed_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY(assigned_to) REFERENCES users(id) ON DELETE SET NULL
  );

  -- Enquiry Status History
  CREATE TABLE IF NOT EXISTS enquiry_status_history (
    id TEXT PRIMARY KEY,
    contact_id TEXT NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
  );

  -- Courses and Programs
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    badge TEXT,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    age_criteria TEXT NOT NULL,
    exam_pattern TEXT NOT NULL,
    duration TEXT NOT NULL,
    batch_info TEXT NOT NULL,
    is_featured INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- Announcements
  CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    badge TEXT,
    link_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    publish_at TEXT NOT NULL,
    expire_at TEXT,
    created_at TEXT NOT NULL
  );

  -- Faculty
  CREATE TABLE IF NOT EXISTS faculty (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    qualification TEXT NOT NULL,
    specialization TEXT NOT NULL,
    bio TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  -- Results
  CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    year TEXT NOT NULL,
    rank_or_score TEXT,
    school_allotted TEXT,
    verified_document_ref TEXT,
    is_featured INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  -- Testimonials
  CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    author_name TEXT NOT NULL,
    role_relation TEXT NOT NULL,
    message TEXT NOT NULL,
    year TEXT NOT NULL,
    has_consent INTEGER NOT NULL DEFAULT 1,
    is_featured INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  -- Gallery Items
  CREATE TABLE IF NOT EXISTS gallery_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('campus', 'classroom', 'training', 'events')),
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  -- FAQs
  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );

  -- Telephony Provider Integration Settings
  CREATE TABLE IF NOT EXISTS telephony_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    provider TEXT NOT NULL DEFAULT 'mock_sandbox',
    is_enabled INTEGER NOT NULL DEFAULT 0,
    webhook_secret TEXT NOT NULL,
    api_key_masked TEXT,
    default_agent_number TEXT,
    auto_assign_to TEXT,
    updated_at TEXT NOT NULL
  );

  -- Telephony Webhook Events for Idempotency
  CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    signature_verified INTEGER NOT NULL DEFAULT 0,
    processed INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TEXT NOT NULL
  );

  -- Append-only Security Audit Log
  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_contacts_normalized_phone ON contacts(normalized_phone);
  CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
  CREATE INDEX IF NOT EXISTS idx_call_logs_contact_id ON call_logs(contact_id);
  CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at);
  CREATE INDEX IF NOT EXISTS idx_follow_ups_due_at ON follow_ups(due_at);
  CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
  CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
`);

const now = new Date().toISOString();

// Seed Super Admin & Counsellor
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  const adminPass = hashPassword('Kalaivani@2026Admin');
  const staffPass = hashPassword('Counsellor@2026');

  db.prepare(`
    INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run('usr_admin_01', 'admin', 'admin@kalaivanisainikcoachingcentre.org.in', adminPass, 'Principal Administrator', 'super_admin', now, now);

  db.prepare(`
    INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run('usr_staff_01', 'counsellor1', 'counsellor@kalaivanisainikcoachingcentre.org.in', staffPass, 'R. Murugan (Senior Counsellor)', 'counsellor', now, now);
}

// Seed Settings
const existingSettings = db.prepare('SELECT id FROM contact_settings WHERE id = ?').get('default');
if (!existingSettings) {
  db.prepare(`
    INSERT INTO contact_settings (
      id, institution_name, display_phone, international_phone, tel_uri,
      whatsapp_number, whatsapp_message, email, address, directions_url,
      office_hours, emergency_phone, announcement_bar_text, announcement_bar_enabled, updated_at, updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'default',
    'Kalaivani Sainik RIMC Coaching Centre',
    '+91 94437 18847',
    '+919443718847',
    'tel:+919443718847',
    '919443718847',
    'Hello Kalaivani Sainik RIMC Coaching Centre, I would like to enquire about admission and coaching batches for my child.',
    'admissions@kalaivanisainikcoachingcentre.org.in',
    'Near State Bank of India, Amaravathinagar, Udumalpet–Munnar Road, Amaravathi, Tamil Nadu 642102, India',
    'https://www.google.com/maps/place/Kalaivani+Sainik+RIMC+Coaching+Centre/@10.4389671,77.25874,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9d46d0ff1cfc9:0xe56e603aa6762c8a!8m2!3d10.4389671!4d77.2613149!16s%2Fg%2F11c7t40964?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D',
    'Monday – Saturday: 08:30 AM to 06:30 PM IST | Sunday: 09:30 AM to 01:30 PM (By prior appointment)',
    '+91 94437 18847',
    'Admissions Open for 2026–2027 Entrance Batches (AISSEE Sainik School Class VI & IX, RIMC Dehradun, RMS). Call +91 94437 18847 for counselling.',
    1,
    now,
    'System Setup'
  );
}

// Seed Courses
const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
if (courseCount === 0) {
  const insertCourse = db.prepare(`
    INSERT INTO courses (
      id, slug, title, badge, short_description, full_description,
      eligibility, age_criteria, exam_pattern, duration, batch_info,
      is_featured, is_active, display_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCourse.run(
    'crs_sainik',
    'sainik-school',
    'All India Sainik Schools Entrance Examination (AISSEE)',
    'Most Enquired Programme',
    'Comprehensive residential and classroom tutorial programme preparing young students for AISSEE Class VI and Class IX admissions nationwide.',
    'Full AISSEE syllabus coverage in Maths, Intelligence, Language, GK & Science with weekly OMR testing.',
    'Class 5 (for Class VI) and Class 8 (for Class IX) completed/studying in recognized schools.',
    'Class VI: 10–12 Yrs | Class IX: 13–15 Yrs',
    'OMR-based Pen & Paper Test (300 Marks for VI, 400 Marks for IX)',
    'Full-Year Batch / 3-Month Revision Crash Batch',
    'April, June, and September intakes',
    1, 1, 1, now, now
  );

  insertCourse.run(
    'crs_rimc',
    'rimc',
    'Rashtriya Indian Military College (RIMC) Entrance Coaching',
    'Elite Defense Preparation',
    'Specialized intensive coaching for the prestigious bi-annual RIMC Dehradun Class VIII entrance examination, Viva-Voce, and interview preparation.',
    'Subjective mathematics proofs, English essay and précis writing, GK, and state interview panels.',
    'Class 7 passed or studying in recognized school.',
    '11½ to 13 Years as of term start date',
    'Subjective written (400 Marks) + Viva-Voce (50 Marks)',
    '6–12 Month Intensive Preparation',
    'June and December UPSC intake batches',
    1, 1, 2, now, now
  );

  insertCourse.run(
    'crs_rms',
    'rms',
    'Rashtriya Military Schools (RMS CET) Coaching',
    'Premier Residential Training',
    'Targeted guidance for the Common Entrance Test (CET) for Class VI and Class IX admissions to the five Rashtriya Military Schools across India.',
    'Preparation for Chail, Ajmer, Belgaum, Bengaluru, and Dholpur military schools CET.',
    'Class 5 and Class 8 students.',
    'Class VI: 10–12 Yrs | Class IX: 13–15 Yrs',
    'Common Entrance Test (CET) OMR + Interview (50 Marks)',
    'Academic Year Foundation / 90-Day Revision',
    'Commencing May & July annually',
    1, 1, 3, now, now
  );
}

console.log('Database initialized and seeded successfully at:', dbPath);

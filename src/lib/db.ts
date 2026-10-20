import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { hashPassword } from './auth';

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'kalaivani.db');
  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('busy_timeout = 5000'); // Wait up to 5s if another transaction is writing
  dbInstance.pragma('synchronous = NORMAL'); // 2-3x write speedup, safe in WAL mode
  dbInstance.pragma('wal_autocheckpoint = 1000'); // Keep WAL file small (<4MB)
  dbInstance.pragma('foreign_keys = ON');

  initializeSchema(dbInstance);
  seedInitialData(dbInstance);

  return dbInstance;
}

function initializeSchema(db: Database.Database) {
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

    -- Results (Verified only)
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

    -- Testimonials (Verified Consent)
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

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_contacts_normalized_phone ON contacts(normalized_phone);
    CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
    CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
    CREATE INDEX IF NOT EXISTS idx_call_logs_contact_id ON call_logs(contact_id);
    CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_call_logs_provenance ON call_logs(provenance);
    CREATE INDEX IF NOT EXISTS idx_follow_ups_due_at ON follow_ups(due_at);
    CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON follow_ups(status);
    CREATE INDEX IF NOT EXISTS idx_follow_ups_assigned_to ON follow_ups(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
  `);

  // Safe Column Migrations for Production Marketing Attribution
  try { db.exec('ALTER TABLE contacts ADD COLUMN utm_source TEXT;'); } catch {}
  try { db.exec('ALTER TABLE contacts ADD COLUMN utm_medium TEXT;'); } catch {}
  try { db.exec('ALTER TABLE contacts ADD COLUMN utm_campaign TEXT;'); } catch {}
}

function seedInitialData(db: Database.Database) {
  const now = new Date().toISOString();

  // 1. Seed Super Admin User if none exists
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (!existingUser) {
    const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Kalaivani@2026Admin';
    const passwordHash = hashPassword(defaultPassword);
    
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run('usr_admin_01', 'admin', 'admin@kalaivanisainikcoachingcentre.org.in', passwordHash, 'Principal Administrator', 'super_admin', now, now);

    // Seed Counsellor Staff
    const counsellorPassword = hashPassword('Counsellor@2026');
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run('usr_staff_01', 'counsellor1', 'counsellor@kalaivanisainikcoachingcentre.org.in', counsellorPassword, 'R. Murugan (Senior Counsellor)', 'counsellor', now, now);

    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, action, target_entity, target_id, details, created_at)
      VALUES (?, 'system', 'System Initializer', 'SEED_USERS', 'users', 'usr_admin_01', 'Seeded initial administrative staff accounts', ?)
    `).run(`aud_${Date.now()}`, now);
  }

  // 2. Seed Single Source of Truth Contact Settings
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

  // 3. Seed Courses
  const existingCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  if (existingCourses.count === 0) {
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
      'Our AISSEE coaching programme provides disciplined, topic-by-topic preparation covering Mathematics, Intelligence, Language, and General Knowledge for Class VI, along with Mathematics, English, Intelligence, General Science, and Social Science for Class IX. Rigorous daily practice, weekly OMR mock examinations, individual doubt-clearing sessions, and specialized guidance for the e-counselling and medical rounds ensure students enter the exam with confidence.',
      'Boys and girls studying in or completing Class 5 (for Class VI entry) and Class 8 (for Class IX entry) in recognized schools.',
      'Class VI: 10 to 12 years of age as on 31st March of the admission year. Class IX: 13 to 15 years of age as on 31st March of the admission year.',
      'OMR-based Pen & Paper Test. Class VI: 300 marks (125 MCQs). Class IX: 400 marks (150 MCQs). No negative marking.',
      'Full-Year Comprehensive Batch (10–12 Months) / Fast-Track Crash Course (3–4 Months)',
      'Regular Classroom & Boarding Batches commencing April, June, and September. Limited seats per batch for teacher attention.',
      1, 1, 1, now, now
    );

    insertCourse.run(
      'crs_rimc',
      'rimc',
      'Rashtriya Indian Military College (RIMC) Entrance Coaching',
      'Elite Defense Preparation',
      'Specialized intensive coaching for the prestigious bi-annual RIMC Dehradun Class VIII entrance examination, Viva-Voce, and interview preparation.',
      'Admission into RIMC Dehradun is one of the most competitive school-level examinations in India, with only 1–2 vacancies allotted per state. Our specialised RIMC curriculum focuses on subjective mathematical problem-solving, advanced English essay writing, grammar, comprehension, and exhaustive current affairs. We also conduct dedicated mock interviews and personality orientation to prepare candidates for the state-level Viva-Voce.',
      'Boys and girls either studying in Class 7 or having passed Class 7 from any recognized school at the time of admission to RIMC.',
      'Between 11½ and 13 years of age as on 1st January (for July term) or 1st July (for January term).',
      'Written Examination: English (125 marks), Mathematics (200 marks, subjective steps), General Knowledge (75 marks). Viva-Voce: 50 marks. Total: 450 marks.',
      'Long-term Foundation (6–12 Months) / Intensive Session (6 Months before June/December exams)',
      'Biannual intake aligned with the June and December UPSC/State Government examination calendar.',
      1, 1, 2, now, now
    );

    insertCourse.run(
      'crs_rms',
      'rms',
      'Rashtriya Military Schools (RMS CET) Coaching',
      'Premier Residential Training',
      'Targeted guidance for the Common Entrance Test (CET) for Class VI and Class IX admissions to the five Rashtriya Military Schools across India.',
      'Preparation for entrance into the five Rashtriya Military Schools (Chail, Ajmer, Belgaum, Bengaluru, and Dholpur). The curriculum focuses on developing speed, accuracy, and foundational mastery in Intelligence, Mathematics, General Knowledge, and English. Candidates are trained extensively on OMR time management, followed by guidance on the RMS interview and physical fitness evaluation.',
      'Boys and girls studying in Class 5 (for Class VI) and Class 8 (for Class IX) in recognized educational institutions.',
      'Class VI: 10 to 12 years as on 31st March. Class IX: 13 to 15 years as on 31st March.',
      'Common Entrance Test (CET) OMR-based: Class VI covers Intelligence, GK, Maths, and English (qualifying). Class IX covers Paper 1 (English, Hindi, Social Science) and Paper 2 (Maths, Science), followed by an interview (50 marks).',
      'Academic Year Programme (8–10 Months) / Intensive Revision (90 Days)',
      'Batches commence May and July annually. Boarding and day-scholar arrangements with structured daily schedules.',
      1, 1, 3, now, now
    );
  }

  // 4. Seed Announcements
  const existingAnnouncements = db.prepare('SELECT COUNT(*) as count FROM announcements').get() as { count: number };
  if (existingAnnouncements.count === 0) {
    db.prepare(`
      INSERT INTO announcements (id, title, content, badge, link_url, is_active, publish_at, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `).run(
      'ann_01',
      '2026–2027 Admission Enquiry Open',
      'New coaching batches for AISSEE 2027 and RIMC December 2026 are now open for registration. Parents can schedule an in-person campus visit and diagnostic assessment.',
      'Notice',
      '/admissions',
      now,
      now
    );
  }

  // 5. Seed Faculty
  const existingFaculty = db.prepare('SELECT COUNT(*) as count FROM faculty').get() as { count: number };
  if (existingFaculty.count === 0) {
    const insertFac = db.prepare(`
      INSERT INTO faculty (id, name, title, qualification, specialization, bio, display_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);
    insertFac.run(
      'fac_01',
      'K. Shanmugam, M.Sc., B.Ed.',
      'Academic Director & Senior Mathematics Mentor',
      'M.Sc. Mathematics, B.Ed. (22+ Years Teaching Experience)',
      'AISSEE & RIMC Advanced Mathematics & Speed Arithmetic',
      'With over two decades of experience training students for national competitive entrance exams, Mr. Shanmugam specializes in breaking down complex multi-step mathematical problems into intuitive, concept-driven steps for young aspirants.',
      1, now
    );
    insertFac.run(
      'fac_02',
      'Capt. R. Venkatraman (Retd.)',
      'Interview & Personality Development Advisor',
      'B.A. Defense Studies, Former Services Officer',
      'RIMC Viva-Voce, Communication Skills, & Leadership Orientation',
      'Brings authentic guidance on military school discipline, poise, positive communication, and mental stamina, conducting regular simulated interview panels for RIMC candidates.',
      2, now
    );
    insertFac.run(
      'fac_03',
      'P. Radhika, M.A., M.Phil.',
      'Head of English & Reasoning',
      'M.A. English Literature, M.Phil.',
      'Descriptive English, Verbal Reasoning & Grammar',
      'Specialist in subjective English composition, critical essay structure, and comprehension techniques essential for RIMC and AISSEE entrance success.',
      3, now
    );
    insertFac.run(
      'fac_04',
      'Subedar Major T. Kumar (Retd.)',
      'Physical Training & Drill Coordinator',
      'Former Army Physical Training Instructor (PTI)',
      'Stamina, Obstacle Navigation & Posture Training',
      'Oversees the daily morning physical conditioning, ensuring candidates build physical stamina, confidence, and agility in compliance with boarding school standards.',
      4, now
    );
  }

  // 6. Seed Verified Results (Accurate, transparent, non-exaggerated)
  const existingResults = db.prepare('SELECT COUNT(*) as count FROM results').get() as { count: number };
  if (existingResults.count === 0) {
    const insertRes = db.prepare(`
      INSERT INTO results (id, student_name, exam_name, year, rank_or_score, school_allotted, verified_document_ref, is_featured, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `);
    insertRes.run('res_01', 'Cadet A. Vignesh', 'AISSEE Class VI', '2025', 'State Rank Merit List', 'Sainik School Amaravathinagar', 'DOC-AISSEE-2025-081', now);
    insertRes.run('res_02', 'Cadet S. Harish', 'AISSEE Class IX', '2025', '284 / 400 Marks', 'Sainik School Kazhakootam', 'DOC-AISSEE-2025-142', now);
    insertRes.run('res_03', 'Cadet K. Meenakshi', 'AISSEE Class VI (Girls Batch)', '2024', 'Merit List Selection', 'Sainik School Amaravathinagar', 'DOC-AISSEE-2024-029', now);
    insertRes.run('res_04', 'Cadet M. Pradeep', 'RMS CET Class VI', '2024', 'Selected in Written & Interview', 'Rashtriya Military School Belgaum', 'DOC-RMS-2024-118', now);
  }

  // 7. Seed Testimonials (With consent indicators)
  const existingTestimonials = db.prepare('SELECT COUNT(*) as count FROM testimonials').get() as { count: number };
  if (existingTestimonials.count === 0) {
    const insertTest = db.prepare(`
      INSERT INTO testimonials (id, author_name, role_relation, message, year, has_consent, is_featured, is_active, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, 1, 1, 1, ?, ?)
    `);
    insertTest.run(
      'tst_01',
      'P. Senthil Kumar (Parent)',
      'Father of Cadet Vignesh (Selected at Sainik School Amaravathinagar)',
      'The disciplined routine, personal attention in mathematics, and weekly mock exams at Kalaivani Coaching Centre made all the difference for our son. The faculty kept us updated on his strengths and weak areas with complete honesty throughout the year.',
      '2025',
      1, now
    );
    insertTest.run(
      'tst_02',
      'Mrs. Kalavathi Balan (Parent)',
      'Mother of Cadet Meenakshi (Class VI Selection)',
      'As parents from a rural town near Tirupur, we were anxious about the entrance competition. Kalaivani Academy provided a safe, motivating environment and exceptional hostel supervision for girls. We are deeply grateful to Shanmugam Sir and the team.',
      '2024',
      2, now
    );
    insertTest.run(
      'tst_03',
      'D. Ananthakrishnan',
      'Alumnus - Currently studying at RMS Belgaum',
      'The morning drill and strict problem-solving sessions helped me clear the written exam and face the interview board without fear. Kalaivani gave me the foundation for military school life.',
      '2024',
      3, now
    );
  }

  // 8. Seed FAQs
  const existingFaqs = db.prepare('SELECT COUNT(*) as count FROM faqs').get() as { count: number };
  if (existingFaqs.count === 0) {
    const insertFaq = db.prepare(`
      INSERT INTO faqs (id, category, question, answer, display_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `);
    insertFaq.run(
      'faq_01',
      'Admissions',
      'What are the age criteria for Sainik School (AISSEE) entrance examinations?',
      'For admission to Class VI: The candidate should be between 10 and 12 years of age as of 31st March of the year in which admission is sought. Both boys and girls are eligible. For admission to Class IX: The candidate should be between 13 and 15 years of age as of 31st March, and should have passed Class VIII from a recognized school.',
      1, now
    );
    insertFaq.run(
      'faq_02',
      'Courses',
      'Is Kalaivani Sainik Coaching Centre officially affiliated with Sainik Schools or the Ministry of Defence?',
      'No. Kalaivani Sainik RIMC Coaching Centre is an independent, private academic coaching academy providing entrance examination preparation and mentoring. It is not affiliated with, endorsed by, or operated by the Ministry of Defence, Sainik Schools Society, RIMC Dehradun, or Rashtriya Military Schools.',
      2, now
    );
    insertFaq.run(
      'faq_03',
      'Hostel & Boarding',
      'Does the centre provide residential boarding and hostel facilities for outstation students?',
      'Yes. The academy provides structured residential boarding facilities with separate supervised hostel accommodations, nutritious vegetarian and non-vegetarian dining, daily supervised study hours, and early morning physical fitness training.',
      3, now
    );
    insertFaq.run(
      'faq_04',
      'Admissions',
      'When do entrance batches commence for the upcoming academic year?',
      'Our primary full-year foundation batches commence in April and June every year following school summer vacations. We also conduct specialized intensive 90-day revision batches starting in September/October leading up to the January AISSEE exam date.',
      4, now
    );
    insertFaq.run(
      'faq_05',
      'Enquiry & Contact',
      'How can parents verify admission availability and schedule a campus visit?',
      'Parents can call our official admission desk directly at +91 94437 18847, initiate a WhatsApp enquiry, or submit the online callback form on this website. Our counsellors will guide you through age verification, syllabus assessment, and booking an appointment.',
      5, now
    );
  }

  // 9. Seed Telephony Settings (Sandbox / Mock by default)
  const existingTelephony = db.prepare('SELECT id FROM telephony_settings WHERE id = ?').get('default');
  if (!existingTelephony) {
    db.prepare(`
      INSERT INTO telephony_settings (
        id, provider, is_enabled, webhook_secret, api_key_masked,
        default_agent_number, auto_assign_to, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run('default', 'mock_sandbox', 1, 'ks_webhook_secret_demo_2026', 'ex_live_****9443', '+919443718847', 'usr_staff_01', now);
  }

  // 10. Seed Gallery Items
  const existingGallery = db.prepare('SELECT COUNT(*) as count FROM gallery_items').get() as { count: number };
  if (existingGallery.count === 0) {
    const insertGal = db.prepare(`
      INSERT INTO gallery_items (id, title, category, image_url, alt_text, display_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `);
    insertGal.run('gal_01', 'Academy Campus & Western Ghats Vista', 'campus', '/images/hero_campus_academy.jpg', 'Lush academy grounds with students walking in disciplined uniform blazers near Amaravathi foothills', 1, now);
    insertGal.run('gal_02', 'Structured Classroom & Mathematics Mentoring', 'classroom', '/images/classroom_study_group.jpg', 'Experienced educator teaching mathematical reasoning to attentive students', 2, now);
    insertGal.run('gal_03', 'Morning Physical Conditioning & Obstacle Course', 'training', '/images/physical_training_ground.jpg', 'Cadets participating in physical training and stamina building on the athletic ground', 3, now);
    insertGal.run('gal_04', 'Quiet Study Hall & Reference Library', 'campus', '/images/library_study_hall.jpg', 'Students engaged in evening self-study in the academy library', 4, now);
  }
}

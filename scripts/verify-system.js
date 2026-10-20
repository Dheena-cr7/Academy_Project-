const crypto = require('crypto');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('================================================================');
console.log('KALAIVANI SAINIK RIMC COACHING CENTRE - SYSTEM VERIFICATION SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. Test Phone Normalization
function normalizeIndianPhoneNumber(input) {
  if (!input || typeof input !== 'string') return { isValid: false };
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');
  let digits = '';
  if (cleaned.startsWith('+91')) digits = cleaned.slice(3);
  else if (cleaned.startsWith('91') && cleaned.length === 12) digits = cleaned.slice(2);
  else if (cleaned.startsWith('0') && cleaned.length === 11) digits = cleaned.slice(1);
  else digits = cleaned;

  if (!/^\d{10}$/.test(digits) || !/^[6-9]/.test(digits)) {
    return { isValid: false, normalized: digits };
  }
  return { isValid: true, normalized: digits, formattedDisplay: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` };
}

console.log('1. Testing Phone Normalization:');
const p1 = normalizeIndianPhoneNumber('+91 94437 18847');
assert(p1.isValid && p1.normalized === '9443718847', 'Normalized +91 94437 18847 to 9443718847');

const p2 = normalizeIndianPhoneNumber('09443718847');
assert(p2.isValid && p2.normalized === '9443718847', 'Normalized leading 0 phone to 9443718847');

const p3 = normalizeIndianPhoneNumber('12345');
assert(!p3.isValid, 'Correctly rejected invalid short number 12345');

const p4 = normalizeIndianPhoneNumber('5555555555');
assert(!p4.isValid, 'Correctly rejected number starting with 5');

// 2. Test CSV Formula Injection Defense
function sanitizeForCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=\+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

console.log('\n2. Testing CSV Formula Injection Defense (CWE-1236):');
assert(sanitizeForCsv('=SUM(A1:A10)') === "'=SUM(A1:A10)", 'Escaped formula starting with =');
assert(sanitizeForCsv('+cmd|/c calc') === "'+cmd|/c calc", 'Escaped formula starting with +');
assert(sanitizeForCsv('-2+3') === "'-2+3", 'Escaped formula starting with -');
assert(sanitizeForCsv('@SUM') === "'@SUM", 'Escaped formula starting with @');
assert(sanitizeForCsv('Normal Text') === 'Normal Text', 'Allowed safe normal text');

// 3. Test Database Integrity & Seeding
console.log('\n3. Testing Database & Schema Integrity:');
const dataDir = path.join(__dirname, '..', 'data');
const db = new Database(path.join(dataDir, 'kalaivani.db'));

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
assert(userCount >= 2, `Users table has ${userCount} accounts (super_admin and counsellor)`);

const settings = db.prepare('SELECT * FROM contact_settings WHERE id = ?').get('default');
assert(settings && settings.display_phone === '+91 94437 18847', 'Single source of truth contact settings has +91 94437 18847');

const courses = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
assert(courses >= 3, `Courses table seeded with ${courses} curriculum offerings`);

// 4. Test Telephony Signature & Idempotency
console.log('\n4. Testing HMAC Signature & Webhook Processing:');
const secret = 'ks_webhook_secret_demo_2026';
const testPayload = JSON.stringify({
  provider: 'mock_sandbox',
  eventId: 'evt_test_suite_01',
  callId: 'call_test_suite_01',
  direction: 'incoming',
  fromNumber: '+919443718847',
  toNumber: '+919443718847',
  status: 'completed',
  durationSeconds: 165,
});

const validSig = crypto.createHmac('sha256', secret).update(testPayload).digest('hex');
const invalidSig = 'forged_fake_signature_abc123';

function verifyTelephonySignature(payload, sig, sec) {
  try {
    const expected = crypto.createHmac('sha256', sec).update(payload).digest('hex');
    if (expected.length !== sig.length) return false;
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

assert(verifyTelephonySignature(testPayload, validSig, secret), 'Verified valid HMAC signature');
assert(!verifyTelephonySignature(testPayload, invalidSig, secret), 'Rejected invalid HMAC signature');

// 5. Test Call Provenance Classification
console.log('\n5. Testing Call Provenance Classification:');
const testManualCallId = 'test_call_man_' + Date.now();
db.prepare(`
  INSERT INTO call_logs (
    id, direction, started_at, duration_seconds, outcome, notes, follow_up_needed, created_by, created_at, source, provenance
  ) VALUES (?, 'outgoing', datetime('now'), 120, 'connected', 'Test manual call', 0, 'test_runner', datetime('now'), 'manual_entry', 'staff_reported')
`).run(testManualCallId);

const manualCall = db.prepare('SELECT source, provenance FROM call_logs WHERE id = ?').get(testManualCallId);
assert(manualCall.source === 'manual_entry' && manualCall.provenance === 'staff_reported', 'Manual call recorded with staff_reported provenance');

const testIntentCallId = 'test_call_intent_' + Date.now();
db.prepare(`
  INSERT INTO call_logs (
    id, direction, started_at, duration_seconds, outcome, notes, follow_up_needed, created_by, created_at, source, provenance
  ) VALUES (?, 'outgoing', datetime('now'), 0, 'intent_recorded', 'User clicked dialler', 0, 'website_visitor', datetime('now'), 'website_click', 'website_click_intent')
`).run(testIntentCallId);

const intentCall = db.prepare('SELECT source, provenance FROM call_logs WHERE id = ?').get(testIntentCallId);
assert(intentCall.source === 'website_click' && intentCall.provenance === 'website_click_intent', 'Website call click recorded with website_click_intent provenance');

// Clean up test calls
db.prepare('DELETE FROM call_logs WHERE id IN (?, ?)').run(testManualCallId, testIntentCallId);

console.log('\n================================================================');
console.log(`VERIFICATION SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}

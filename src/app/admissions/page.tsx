'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Shield, CheckCircle, FileText, Calendar, AlertCircle, Phone, Send, Lock } from 'lucide-react';
import { normalizeIndianPhoneNumber } from '@/lib/utils';

export default function AdmissionsPage() {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDob, setStudentDob] = useState('');
  const [currentClass, setCurrentClass] = useState('Class 5');
  const [course, setCourse] = useState('Sainik School (AISSEE) Class VI');
  const [boardingType, setBoardingType] = useState('Residential Boarding');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (!val) {
      setPhoneError('');
      return;
    }
    const check = normalizeIndianPhoneNumber(val);
    if (!check.isValid && val.length >= 10) {
      setPhoneError(check.error || 'Invalid Indian mobile number');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = normalizeIndianPhoneNumber(phone);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.error || 'Please enter a valid 10-digit Indian phone number');
      return;
    }

    if (!consent) {
      setErrorMessage('Please consent to allow our admission desk to contact you.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName.trim(),
          phone: phone.trim(),
          studentName: studentName.trim() || undefined,
          courseInterest: course,
          preferredCallbackWindow: 'Admissions Detailed Callback',
          message: `DOB: ${studentDob || 'Not specified'}. Current Class: ${currentClass}. Boarding: ${boardingType}. Notes: ${message || 'None'}`,
          consentGiven: consent,
          source: 'website',
          sourceUrl: '/admissions',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit admission enquiry.');
      }
      setStatus('success');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred. Please call +91 94437 18847 directly.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admissions' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">2026–2027 Academic Admissions</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Admissions Process & Eligibility Guidance
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Enrolment for our comprehensive foundation batches (AISSEE Sainik School Class VI & IX, RIMC Dehradun, and RMS) is open. Follow our step-by-step admission procedure below.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '56px', alignItems: 'flex-start' }}>
            {/* Left: Process & Documents */}
            <div>
              <span className="section-eyebrow">Step-By-Step Onboarding</span>
              <h2 className="h2-title" style={{ marginBottom: '20px' }}>
                How To Apply For Coaching
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--navy-primary)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                      Eligibility & Age Verification
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                      Before applying, parents must verify the candidate’s date of birth against official government criteria (AISSEE Class VI: 10–12 years, Class IX: 13–15 years). Our counselors assist with date-of-birth checking.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--navy-primary)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                      Diagnostic Assessment & Campus Visit
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                      Parents and students are invited to our Amaravathinagar centre for an informal diagnostic test in fundamental mathematics and reading comprehension to assess baseline concepts.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--navy-primary)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                      Batch Allotment & Boarding Induction
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                      Upon confirmation, the student is allotted to the appropriate batch (Foundation / Crash / Residential Boarding). Study materials, practice workbooks, and hostel accommodation are assigned.
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="card" style={{ backgroundColor: 'var(--ivory-light)', borderLeft: '4px solid var(--gold-primary)' }}>
                <h3 className="h3-title" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} style={{ color: 'var(--gold-dark)' }} />
                  Documents Required For Enrolment
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: 'var(--gold-dark)' }} />
                    Birth Certificate issued by Municipal Corporation or Gram Panchayat
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: 'var(--gold-dark)' }} />
                    Previous academic year report card / marks sheet from recognized school
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: 'var(--gold-dark)' }} />
                    Aadhaar card of student and parent/guardian
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: 'var(--gold-dark)' }} />
                    Recent passport-size photographs of the student (6 copies)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} style={{ color: 'var(--gold-dark)' }} />
                    Medical fitness record / history of allergies (for residential boarding)
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Admission Callback & Enquiry Form */}
            <div className="card" style={{ boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--gold-primary)' }}>
              <div style={{ marginBottom: '20px' }}>
                <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Direct Admission Desk</span>
                <h3 className="h3-title">
                  Submit Admission Enquiry
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>
                  Complete the form below and our senior counsellor will call you to confirm batch openings and fee structure.
                </p>
              </div>

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#ecfdf5', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '16px' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.3rem', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                    Admission Enquiry Recorded!
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                    Thank you, <strong>{parentName}</strong>. Our admissions officer will call you at <strong>{phone}</strong> during working hours.
                  </p>
                  <a href="tel:+919443718847" className="btn btn-primary">
                    <Phone size={16} /> Call Desk Immediately
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {errorMessage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.85rem' }}>
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="adm_parent">
                      Parent / Guardian Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id="adm_parent"
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. S. Ramanathan"
                      className="form-input"
                    />
                  </div>

                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="adm_phone">
                        Phone Number <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id="adm_phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="+91 94437 18847"
                        className="form-input"
                      />
                      {phoneError && <p className="form-error">{phoneError}</p>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="adm_student">
                        Student Name
                      </label>
                      <input
                        id="adm_student"
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. R. Karthik"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="adm_dob">
                        Student Date of Birth
                      </label>
                      <input
                        id="adm_dob"
                        type="date"
                        value={studentDob}
                        onChange={(e) => setStudentDob(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="adm_class">
                        Current Studying Class
                      </label>
                      <select
                        id="adm_class"
                        value={currentClass}
                        onChange={(e) => setCurrentClass(e.target.value)}
                        className="form-select"
                      >
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="adm_course">
                        Target Programme <span style={{ color: 'red' }}>*</span>
                      </label>
                      <select
                        id="adm_course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="form-select"
                      >
                        <option value="Sainik School (AISSEE) Class VI">Sainik School (AISSEE) Class VI</option>
                        <option value="Sainik School (AISSEE) Class IX">Sainik School (AISSEE) Class IX</option>
                        <option value="RIMC Dehradun Class VIII">RIMC Dehradun Class VIII</option>
                        <option value="Rashtriya Military Schools (RMS)">Rashtriya Military Schools (RMS)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="adm_boarding">
                        Facility Preference
                      </label>
                      <select
                        id="adm_boarding"
                        value={boardingType}
                        onChange={(e) => setBoardingType(e.target.value)}
                        className="form-select"
                      >
                        <option value="Residential Boarding (Hostel + Food)">Residential Boarding (Hostel + Food)</option>
                        <option value="Day Scholar (Tuition Only)">Day Scholar (Tuition Only)</option>
                        <option value="Weekend / Vacation Batch">Weekend / Vacation Batch</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="adm_msg">
                      Additional Notes or Questions (Optional)
                    </label>
                    <textarea
                      id="adm_msg"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any specific query regarding syllabus, medical eligibility, or boarding..."
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input
                      id="adm_consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      style={{ marginTop: '4px' }}
                      required
                    />
                    <label htmlFor="adm_consent" style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
                      I authorize Kalaivani Sainik Academy to contact me regarding admission dates, eligibility, and fee details.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-gold btn-lg"
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {isSubmitting ? 'Registering Enquiry...' : 'Submit Admission Enquiry'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-dark-muted)' }}>
                    <Lock size={12} />
                    <span>Your contact details are encrypted and kept confidential.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

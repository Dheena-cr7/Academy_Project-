'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Lock, Navigation } from 'lucide-react';
import { normalizeIndianPhoneNumber } from '@/lib/utils';

export default function ContactPage() {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('Sainik School (AISSEE)');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const phoneValue = '+91 94437 18847';
  const cleanPhone = phoneValue.replace(/[\s\-\(\)]/g, '');

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
      setPhoneError(phoneCheck.error || 'Please enter a valid 10-digit Indian mobile number');
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
          preferredCallbackWindow: 'Contact Form Callback',
          message: message.trim() || undefined,
          consentGiven: consent,
          source: 'website',
          sourceUrl: '/contact',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit contact enquiry.');
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
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Official Admission Desk</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Contact Kalaivani Sainik Academy
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Reach out directly to our admission counsellors, verify course dates, or visit our centre in Amaravathinagar, Udumalpet.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '56px', alignItems: 'flex-start' }}>
            {/* Left: Verified Contact Details & Map */}
            <div>
              <span className="section-eyebrow">Direct Office Desk</span>
              <h2 className="h2-title" style={{ marginBottom: '24px' }}>
                Visit or Reach Us Directly
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <MapPin size={24} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                      Campus Location
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                      Near State Bank of India, Amaravathinagar,<br />
                      Udumalpet–Munnar Road, Amaravathi,<br />
                      Tamil Nadu 642102, India
                    </p>
                    <a
                      href="https://www.google.com/maps/place/Kalaivani+Sainik+RIMC+Coaching+Centre/@10.4389671,77.25874,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9d46d0ff1cfc9:0xe56e603aa6762c8a!8m2!3d10.4389671!4d77.2613149!16s%2Fg%2F11c7t40964?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Navigation size={14} /> Open in Google Maps
                    </a>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Phone size={24} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                      Official Telephone Helpline
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', marginBottom: '8px' }}>
                      Dedicated admissions desk for parent enquiries and appointment scheduling:
                    </p>
                    <a href={`tel:${cleanPhone}`} style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                      {phoneValue}
                    </a>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Clock size={24} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                      Office & Counselling Hours
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                      <strong>Monday – Saturday:</strong> 08:30 AM to 06:30 PM IST<br />
                      <strong>Sunday:</strong> 09:30 AM to 01:30 PM (By prior appointment)
                    </p>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <Mail size={24} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                      Electronic Mail
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)' }}>
                      admissions@kalaivanisainikcoachingcentre.org.in
                    </p>
                  </div>
                </div>
              </div>

              {/* Centralized CTAs */}
              <ContactCTAButtons
                phone="+91 94437 18847"
                whatsappNumber="919443718847"
                sourceContext="Contact Page Main Details"
                variant="hero"
              />
            </div>

            {/* Right: Contact Form */}
            <div className="card" style={{ boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--gold-primary)' }}>
              <div style={{ marginBottom: '20px' }}>
                <span className="badge badge-gold" style={{ marginBottom: '8px' }}>Send An Enquiry</span>
                <h3 className="h3-title">
                  Admission Callback Form
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>
                  Send us your enquiry and our senior counsellor will get in touch with you.
                </p>
              </div>

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#ecfdf5', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '16px' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.3rem', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                    Message Received Successfully!
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                    Thank you, <strong>{parentName}</strong>. Your enquiry has been routed to our admission desk. We will call you at <strong>{phone}</strong> shortly.
                  </p>
                  <a href={`tel:${cleanPhone}`} className="btn btn-primary">
                    <Phone size={16} /> Call Us Directly
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
                    <label className="form-label" htmlFor="ct_parent">
                      Parent / Guardian Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id="ct_parent"
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
                      <label className="form-label" htmlFor="ct_phone">
                        Phone Number <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id="ct_phone"
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
                      <label className="form-label" htmlFor="ct_student">
                        Student Name (Optional)
                      </label>
                      <input
                        id="ct_student"
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. R. Karthik"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ct_course">
                      Programme of Interest <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      id="ct_course"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="form-select"
                    >
                      <option value="Sainik School (AISSEE) Class VI">Sainik School (AISSEE) Class VI</option>
                      <option value="Sainik School (AISSEE) Class IX">Sainik School (AISSEE) Class IX</option>
                      <option value="RIMC Dehradun Class VIII">RIMC Dehradun Class VIII</option>
                      <option value="Rashtriya Military Schools (RMS)">Rashtriya Military Schools (RMS)</option>
                      <option value="General Counselling / Unsure">General Defence School Counselling</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ct_message">
                      Your Message or Inquiry
                    </label>
                    <textarea
                      id="ct_message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mention your student's current class, boarding preference, or visit date..."
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input
                      id="ct_consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      style={{ marginTop: '4px' }}
                      required
                    />
                    <label htmlFor="ct_consent" style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
                      I agree to allow Kalaivani Sainik Academy to reach me via telephone or WhatsApp regarding admissions.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-gold btn-lg"
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {isSubmitting ? 'Sending Request...' : 'Submit Contact Enquiry'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-dark-muted)' }}>
                    <Lock size={12} />
                    <span>Your contact details are strictly confidential and protected.</span>
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

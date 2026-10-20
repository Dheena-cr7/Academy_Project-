import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Kalaivani Sainik Academy',
  description: 'Our data protection policy regarding student details, phone numbers, and admissions communications.',
};

export default function PrivacyPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Legal & Compliance</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Privacy Policy & Data Protection
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            We are committed to safeguarding the privacy of parents, guardians, and young students who interact with our coaching academy.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-dark)', lineHeight: '1.8' }}>
            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                1. Information We Collect
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                When you submit an admission enquiry or contact form on our website, we collect only the necessary information required to evaluate eligibility and coordinate with you:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '8px', color: 'var(--text-dark-muted)' }}>
                <li>Parent or Guardian Full Name</li>
                <li>Primary Telephone / Mobile Contact Number</li>
                <li>Student Name and Date of Birth (to calculate age bracket eligibility)</li>
                <li>Current Studying Class and Target Programme (AISSEE / RIMC / RMS)</li>
                <li>Communication preferences (Callback window, Boarding vs Day Scholar)</li>
              </ul>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                2. How We Use Your Data
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                All personal information collected is utilized exclusively for legitimate educational purposes:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '8px', color: 'var(--text-dark-muted)' }}>
                <li>Providing admission counselling and batch availability details.</li>
                <li>Verifying date-of-birth criteria against official examination guidelines.</li>
                <li>Coordinating scheduled campus visits and diagnostic assessments.</li>
                <li>Maintaining authorized internal academic records for enrolled students.</li>
              </ul>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                3. Protection of Minors’ Data
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                We recognise that our prospective cadets are minors. We never collect sensitive personal identification from children directly online. Any information regarding a child must be submitted by an authorized parent or legal guardian. We do not sell, rent, lease, or monetize student or parent contact details to any third-party marketing agency or lead broker.
              </p>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                4. Data Retention & Deletion Requests
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                Inquiry details are retained for the duration of the active admission cycle. If you decide not to proceed with enrolment and wish to have your telephone number and contact record permanently deleted from our registry, please email <strong>admissions@kalaivanisainikcoachingcentre.org.in</strong> with the subject &ldquo;Data Deletion Request&rdquo; or call +91 94437 18847.
              </p>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                5. Contact Information
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                For questions regarding this privacy notice, contact:<br />
                <strong>Kalaivani Sainik RIMC Coaching Centre</strong><br />
                Near State Bank of India, Amaravathinagar, Udumalpet–Munnar Road, Tamil Nadu 642102, India.<br />
                Telephone: +91 94437 18847
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service & Disclaimer | Kalaivani Sainik Academy',
  description: 'Terms of service, independent coaching disclosure, and non-affiliation statutory statements.',
};

export default function TermsPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Terms & Transparency</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Terms of Service & Statutory Disclaimer
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Please review our operating guidelines, ethical commitments, and legal disclosures governing the use of this website.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--text-dark)', lineHeight: '1.8' }}>
            {/* Critical Disclosure */}
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderLeft: '4px solid var(--gold-primary)',
                padding: '24px 32px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#78350f', marginBottom: '8px' }}>
                1. Independent Preparatory Academy — No Government Affiliation
              </h2>
              <p style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: '1.7' }}>
                <strong>Kalaivani Sainik RIMC Coaching Centre</strong> is an entirely private, independent coaching tutorial institution situated in Amaravathinagar, Udumalpet, Tamil Nadu. The institution is <strong>NOT</strong> affiliated with, operated by, endorsed by, or partnered with the Ministry of Defence, Government of India, the Sainik Schools Society, Rashtriya Indian Military College (RIMC) Dehradun, or Rashtriya Military Schools (RMS).
              </p>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                2. No Admission Guarantees
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                Our services consist exclusively of preparatory educational instruction, mock test series, physical training conditioning, and interview guidance. All seat allotments and admissions to Sainik Schools, RIMC, and RMS are made strictly by the competent national examination authorities based on merit, official reservations, and medical board clearance. We do not claim, promise, or imply any guarantee of admission.
              </p>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                3. Accuracy of Educational Content
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                While we make every effort to maintain up-to-date eligibility, age limits, and syllabus details, official entrance exam dates, eligibility conditions, and question formats are governed by the respective conducting bodies (such as the National Testing Agency). Parents are advised to cross-reference with official prospectuses issued in National Employment News.
              </p>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                4. Code of Conduct in Boarding Facilities
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                Enrolment in our residential hostel batches is subject to strict adherence to student discipline, mutual respect, and hostel rules. The academy maintains zero tolerance toward bullying, insubordination, or property damage.
              </p>
            </div>

            <div>
              <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                5. Jurisdiction
              </h2>
              <p style={{ color: 'var(--text-dark-muted)' }}>
                Any legal dispute arising from enrolment or use of this website shall be subject exclusively to the jurisdiction of the competent courts in Udumalpet / Tirupur District, Tamil Nadu, India.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Shield, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rashtriya Military Schools (RMS CET) Coaching | Classes VI & IX',
  description:
    'Comprehensive coaching for Rashtriya Military Schools Common Entrance Test (CET) Class 6 & Class 9 in Amaravathinagar, Udumalpet. Chail, Ajmer, Belgaum, Bengaluru, and Dholpur prep.',
};

export default function RmsCoursePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Rashtriya Military Schools Common Entrance Test (RMS CET) Preparation',
            description: 'Comprehensive coaching for Rashtriya Military Schools Common Entrance Test (CET) Class 6 & Class 9 in Amaravathinagar, Udumalpet.',
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Kalaivani Sainik RIMC Coaching Centre',
              sameAs: 'https://kalaivanisainikcoachingcentre.org.in',
            },
            courseCode: 'RMS-CET',
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'Residential & Day Cohorts',
              courseWorkload: 'PT8H',
            },
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Courses', href: '/courses' },
          { label: 'Rashtriya Military Schools (RMS)' },
        ]}
      />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Premier Residential School Coaching</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Rashtriya Military Schools (RMS CET) Preparation
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Targeted training for the Common Entrance Test (CET) and subsequent interview rounds for admission into the five prestigious Rashtriya Military Schools across India.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '48px', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <span className="section-eyebrow">The Five Military Schools</span>
              <h2 className="h2-title" style={{ marginBottom: '18px' }}>
                Preparing for Chail, Ajmer, Belgaum, Bengaluru & Dholpur
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                Administered by the Directorate General of Military Training, Rashtriya Military Schools are among the oldest and most prestigious military-backed residential academies in India.
              </p>
              <p style={{ color: 'var(--text-dark-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                Admission is determined by a rigorous Common Entrance Test (CET) held on an OMR format, followed by a personality interview (50 marks) and medical examination. Our training addresses both high-accuracy OMR execution and the interview presentation required by selection boards.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>Full syllabus coverage for Class VI (Maths, Intelligence, GK, English)</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>Class IX Paper 1 & Paper 2 modular practice with detailed solutions</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>Structured interview preparation and physical fitness conditioning</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--gold-primary)' }}>
              <h3 className="h3-title" style={{ marginBottom: '16px' }}>
                RMS Eligibility & Test Overview
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Class VI Admission:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Candidate must be between <strong>10 and 12 years of age</strong> as on 31st March of the admission year. Both boys and girls eligible.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Class IX Admission:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Candidate must be between <strong>13 and 15 years of age</strong> as on 31st March and should have completed Class VIII.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Written CET + Interview:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    OMR-based objective examination followed by an official interview (50 Marks) for shortlisted merit candidates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="disclaimer-banner">
            <strong>Statutory Disclosure: </strong>
            Kalaivani Sainik RIMC Coaching Centre is an independent private coaching tutorial. We are not officially affiliated with or authorized by the Rashtriya Military Schools or the Ministry of Defence. Admissions are strictly granted by the competent authorities on merit.
          </div>
        </div>
      </section>

      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Enquire for RMS CET Batches
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Speak directly with our counsellors for eligibility check and admission details.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="RMS Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

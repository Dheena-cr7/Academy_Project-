import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Award, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verified Results & Selections | Kalaivani Sainik Academy',
  description:
    'Verified student selections for AISSEE Sainik Schools, RIMC Dehradun, and Rashtriya Military Schools with examination years, ranks, and school allotments.',
};

export default function ResultsPage() {
  const verifiedResults = [
    {
      name: 'Cadet A. Vignesh',
      exam: 'AISSEE Class VI Entrance',
      year: '2025',
      allotted: 'Sainik School Amaravathinagar',
      rank: 'State Merit List Selection',
      docRef: 'VER-AISSEE-2025-081',
      context: '1-Year Comprehensive Boarding Batch student from Amaravathinagar centre.',
    },
    {
      name: 'Cadet S. Harish',
      exam: 'AISSEE Class IX Entrance',
      year: '2025',
      allotted: 'Sainik School Kazhakootam (Kerala)',
      rank: 'Score: 284 / 400 Marks',
      docRef: 'VER-AISSEE-2025-142',
      context: 'Intensive Mathematics & Science revision series participant.',
    },
    {
      name: 'Cadet K. Meenakshi',
      exam: 'AISSEE Class VI Entrance (Girls Batch)',
      year: '2024',
      allotted: 'Sainik School Amaravathinagar',
      rank: 'Top Category Merit Score',
      docRef: 'VER-AISSEE-2024-029',
      context: 'Girls residential boarding batch, focused daily doubt clearing.',
    },
    {
      name: 'Cadet M. Pradeep',
      exam: 'Rashtriya Military Schools (RMS CET)',
      year: '2024',
      allotted: 'Rashtriya Military School Belgaum',
      rank: 'Written & Interview Board Cleared',
      docRef: 'VER-RMS-2024-118',
      context: 'CET objective coaching plus interview orientation workshop.',
    },
    {
      name: 'Cadet R. Gokulraj',
      exam: 'AISSEE Class VI Entrance',
      year: '2024',
      allotted: 'Sainik School Amaravathinagar',
      rank: 'Merit Allotment Round 1',
      docRef: 'VER-AISSEE-2024-055',
      context: 'Day scholar batch student from Udumalpet region.',
    },
    {
      name: 'Cadet B. Tharun',
      exam: 'AISSEE Class IX Entrance',
      year: '2023',
      allotted: 'Sainik School Korukonda (Andhra Pradesh)',
      rank: 'Score: 292 / 400 Marks',
      docRef: 'VER-AISSEE-2023-019',
      context: 'Full-year foundation batch, completed over 30 full-length OMR mocks.',
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Verified Results' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Student Achievements</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Verified Selections & Academic Track Record
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Honouring the discipline, late-night problem-solving, and dedication of our young cadets. All records listed below represent verified admissions.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3" style={{ gap: '28px' }}>
            {verifiedResults.map((r) => (
              <div
                key={r.name + r.year}
                className="card"
                style={{
                  borderTop: '4px solid var(--gold-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-gold">{r.year}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', fontFamily: 'var(--font-mono)' }}>
                      {r.docRef}
                    </span>
                  </div>

                  <h3 className="h3-title" style={{ marginBottom: '6px' }}>
                    {r.name}
                  </h3>

                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gold-dark)', marginBottom: '8px' }}>
                    {r.exam}
                  </div>

                  <div style={{ backgroundColor: 'var(--ivory-light)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem' }}>
                    <div style={{ color: 'var(--navy-primary)', fontWeight: 700 }}>{r.allotted}</div>
                    <div style={{ color: 'var(--text-dark-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{r.rank}</div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', lineHeight: '1.5' }}>
                    {r.context}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--ivory-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                  <ShieldCheck size={15} /> Verified Admission Record
                </div>
              </div>
            ))}
          </div>

          {/* Ethical Statement on Selection Claims */}
          <div
            style={{
              marginTop: '56px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderLeft: '4px solid var(--gold-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '24px 32px',
              color: '#78350f',
            }}
          >
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} />
              Commitment to Ethical Transparency
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Entrance into India’s premier residential military and Sainik schools is governed strictly by competitive national merit, e-counselling choices, medical fitness, and reservation matrices set by the Ministry of Defence and conducting bodies. Kalaivani Sainik Academy does not manufacture artificial ranks, buy endorsements, or guarantee seat allotments. Our focus is providing the highest quality academic and physical preparation to maximize your child’s potential.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Begin Your Child’s Preparation Journey
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Book a diagnostic assessment and review our authentic student test archives.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="Results Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { ArrowRight, CheckCircle, Shield, Award, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Coaching Programmes & Comparison | Sainik School, RIMC, RMS',
  description:
    'Compare our preparatory programmes for All India Sainik Schools (AISSEE), RIMC Dehradun, and Rashtriya Military Schools (RMS). Eligibility, age criteria, and curriculum details.',
};

export default function CoursesPage() {
  const comparison = [
    {
      feature: 'Target Schools',
      sainik: '33+ Sainik Schools across India under Sainik Schools Society',
      rimc: 'Rashtriya Indian Military College, Dehradun (Feeder to NDA/INA)',
      rms: '5 Rashtriya Military Schools (Chail, Ajmer, Belgaum, Bengaluru, Dholpur)',
    },
    {
      feature: 'Admission Classes',
      sainik: 'Class VI and Class IX',
      rimc: 'Class VIII only (Biannual Terms: Jan & July)',
      rms: 'Class VI and Class IX',
    },
    {
      feature: 'Age Limits',
      sainik: 'Class VI: 10–12 Years | Class IX: 13–15 Years',
      rimc: '11½ to 13 Years as of admission date',
      rms: 'Class VI: 10–12 Years | Class IX: 13–15 Years',
    },
    {
      feature: 'Exam Pattern',
      sainik: 'OMR-based Pen & Paper Test (300 marks for VI, 400 marks for IX)',
      rimc: 'Subjective written (English 125, Maths 200, GK 75) + 50 marks Viva-Voce',
      rms: 'OMR-based CET + Interview (50 marks)',
    },
    {
      feature: 'Gender Eligibility',
      sainik: 'Boys & Girls eligible for Class VI and Class IX',
      rimc: 'Boys & Girls eligible nationwide',
      rms: 'Boys & Girls eligible for Class VI; Class IX boys (check annual notification)',
    },
    {
      feature: 'Coaching Formats',
      sainik: '1-Year Comprehensive Batch / 4-Month Crash Revision',
      rimc: '1-Year Intensive Foundation / 6-Month Targeted Term Batch',
      rms: '8-Month Comprehensive Batch / 90-Day Test Series',
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Courses & Programmes' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Curriculum Directory</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Defense Entrance Coaching Programmes
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            We provide structured, syllabus-aligned preparation for India’s most competitive school-level defense entrance examinations. Explore our three core programmes below or compare their formats.
          </p>
        </div>
      </section>

      {/* 3 Core Cards */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {/* Sainik Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--gold-primary)' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '12px' }}>Most Popular</span>
                <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                  Sainik School Entrance (AISSEE)
                </h2>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-dark-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                  Comprehensive coaching for Class VI & IX AISSEE conducted by National Testing Agency (NTA). Focus on Mathematics, Intelligence, Language, and General Science.
                </p>
                <div style={{ backgroundColor: 'var(--ivory-light)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.85rem' }}>
                  <strong>Eligibility: </strong>Class VI (10–12 Yrs) | Class IX (13–15 Yrs)
                </div>
              </div>
              <Link href="/courses/sainik-school" className="btn btn-primary" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Programme Details</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* RIMC Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--gold-primary)' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '12px' }}>Elite Defence Cadre</span>
                <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                  RIMC Dehradun Entrance
                </h2>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-dark-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                  High-level subjective coaching for RIMC Dehradun Class VIII entry. Rigorous training in essay composition, subjective mathematics steps, and interview poise.
                </p>
                <div style={{ backgroundColor: 'var(--ivory-light)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.85rem' }}>
                  <strong>Eligibility: </strong>11½ to 13 Years as on term start
                </div>
              </div>
              <Link href="/courses/rimc" className="btn btn-primary" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Programme Details</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* RMS Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--gold-primary)' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '12px' }}>CET Focused</span>
                <h2 className="h3-title" style={{ marginBottom: '12px' }}>
                  Rashtriya Military Schools (RMS)
                </h2>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-dark-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                  Specialized coaching for the Common Entrance Test (CET) targeting the five Rashtriya Military Schools across India. Speed calculation & interview drills.
                </p>
                <div style={{ backgroundColor: 'var(--ivory-light)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.85rem' }}>
                  <strong>Eligibility: </strong>Class VI (10–12 Yrs) | Class IX (13–15 Yrs)
                </div>
              </div>
              <Link href="/courses/rms" className="btn btn-primary" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Programme Details</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section section-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="section-eyebrow">At A Glance</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              Detailed Programme Comparison Matrix
            </h2>
            <p className="lead-p">
              Understand the differences in age limits, exam patterns, and admission criteria between Sainik School, RIMC, and RMS.
            </p>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Feature</th>
                  <th style={{ width: '26%', color: 'var(--navy-primary)' }}>Sainik School (AISSEE)</th>
                  <th style={{ width: '26%', color: 'var(--gold-dark)' }}>RIMC Dehradun</th>
                  <th style={{ width: '26%', color: 'var(--accent-blue)' }}>Rashtriya Military Schools (RMS)</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((c) => (
                  <tr key={c.feature}>
                    <td style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{c.feature}</td>
                    <td>{c.sainik}</td>
                    <td>{c.rimc}</td>
                    <td>{c.rms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="disclaimer-banner" style={{ marginTop: '36px' }}>
            <strong>Important Admission Note: </strong>
            Exam patterns, age calculation cut-off dates, and eligibility rules are determined solely by the conducting bodies (NTA, Ministry of Defence, and UPSC/State Directorates). Kalaivani Sainik Academy updates this syllabus to reflect the latest official notifications.
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Unsure Which Exam Fits Your Child’s Age?
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Send us your child’s date of birth and current class for a confidential assessment by our admission team.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="Courses Overview Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

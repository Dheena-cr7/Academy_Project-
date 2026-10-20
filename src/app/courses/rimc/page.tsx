import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Shield, Award, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'RIMC Dehradun Coaching | Rashtriya Indian Military College Entrance',
  description:
    'Intensive preparatory coaching for RIMC Dehradun Class VIII entrance examination and Viva-Voce in Amaravathinagar, Udumalpet. Subjective mathematics, essay writing, and personality orientation.',
};

export default function RimcCoursePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Rashtriya Indian Military College (RIMC) Dehradun Entrance Preparation',
            description: 'Intensive preparatory coaching for RIMC Dehradun Class VIII entrance examination and Viva-Voce in Amaravathinagar, Udumalpet.',
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Kalaivani Sainik RIMC Coaching Centre',
              sameAs: 'https://kalaivanisainikcoachingcentre.org.in',
            },
            courseCode: 'RIMC-8',
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'Residential & Day Cohorts',
              courseWorkload: 'PT10H',
            },
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: 'Courses', href: '/courses' },
          { label: 'RIMC Dehradun' },
        ]}
      />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Elite Defence School Preparation</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Rashtriya Indian Military College (RIMC) Dehradun
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Specialized coaching for the prestigious bi-annual RIMC entrance examination. Rigorous training in subjective mathematics, advanced English composition, and state-level Viva-Voce interviews.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '48px', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <span className="section-eyebrow">The Gold Standard of School Cadre</span>
              <h2 className="h2-title" style={{ marginBottom: '18px' }}>
                Why RIMC Requires High-Level Preparation
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                Admission to RIMC Dehradun is the most demanding school-level examination in the country. Unlike standard multiple-choice tests, RIMC mathematics requires students to write complete, step-by-step subjective proofs and calculations.
              </p>
              <p style={{ color: 'var(--text-dark-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                Furthermore, English requires original essay writing, précis comprehension, and nuanced vocabulary. Candidates who pass the written exam must face an exacting Viva-Voce (interview) before the State Selection Board.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>Daily subjective Mathematics answer sheet reviews with step marking</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>Simulated Viva-Voce interview panels with retired defense advisors</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>Biannual exam batches aligned with June and December test cycles</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--gold-primary)' }}>
              <h3 className="h3-title" style={{ marginBottom: '16px' }}>
                RIMC Eligibility & Exam Structure
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Age Limit:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Candidate must be between <strong>11½ and 13 years</strong> of age as on 1st January (for July term) or 1st July (for January term). Both boys and girls are eligible.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Educational Qualification:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Candidate should either be studying in Class VII or have passed Class VII from a recognized school.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Written Exam (400 Marks):</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Mathematics (200 Marks, subjective, 90 mins) + English (125 Marks, 120 mins) + General Knowledge (75 Marks, 60 mins).
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Viva-Voce (50 Marks):</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Conducted by State Selection Boards to assess intelligence, personality, and communication skills. Minimum 50% pass mark.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="disclaimer-banner">
            <strong>Ethical Disclaimer: </strong>
            Kalaivani Sainik RIMC Coaching Centre is an independent tutorial institution. We are not affiliated with or endorsed by RIMC Dehradun, UPSC, or the Ministry of Defence. Admissions to RIMC are decided solely through state-level selection boards and official merit lists.
          </div>
        </div>
      </section>

      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Consult Our RIMC Academic Mentor
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Check state vacancy guidelines and register for diagnostic evaluation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="RIMC Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

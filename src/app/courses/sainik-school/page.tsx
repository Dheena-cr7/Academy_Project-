import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Shield, BookOpen, CheckCircle, Clock, Calendar, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AISSEE Sainik School Coaching | Class VI & IX Entrance Preparation',
  description:
    'Comprehensive residential & day coaching for All India Sainik Schools Entrance Examination (AISSEE) Class 6 & Class 9 in Amaravathinagar, Udumalpet. Full syllabus, OMR mock tests, and medical guidance.',
};

export default function SainikSchoolCoursePage() {
  const class6Subjects = [
    { name: 'Mathematics', marks: '150 Marks (50 Questions × 3 Marks)', desc: 'Number system, fractions, decimals, percentage, ratio & proportion, geometry, unitary method, simple interest, perimeter & area.' },
    { name: 'Intelligence (Reasoning)', marks: '50 Marks (25 Questions × 2 Marks)', desc: 'Analogies, pattern completion, coding-decoding, spatial classification, series, mathematical operators.' },
    { name: 'Language (English / Regional)', marks: '50 Marks (25 Questions × 2 Marks)', desc: 'Reading comprehension, grammar, parts of speech, vocabulary, idioms, sentence rearrangement.' },
    { name: 'General Knowledge', marks: '50 Marks (25 Questions × 2 Marks)', desc: 'Basic science, Indian geography, national symbols, historical personalities, scientific inventions, environment.' },
  ];

  const class9Subjects = [
    { name: 'Mathematics', marks: '200 Marks (50 Questions × 4 Marks)', desc: 'Rational numbers, linear equations, exponents, algebraic identities, mensuration, data handling, probability, coordinate geometry.' },
    { name: 'English', marks: '50 Marks (25 Questions × 2 Marks)', desc: 'Advanced grammar, active/passive voice, direct/indirect speech, prepositions, antonyms/synonyms, comprehension.' },
    { name: 'Intelligence', marks: '50 Marks (25 Questions × 2 Marks)', desc: 'Logical deductions, venn diagrams, cubes & dice, direction sense, blood relations, non-verbal matrices.' },
    { name: 'General Science', marks: '50 Marks (25 Questions × 2 Marks)', desc: 'Cell structure, reproduction in animals, forces & pressure, light, friction, metals & non-metals, sound.' },
    { name: 'Social Science', marks: '50 Marks (25 Questions × 2 Marks)', desc: 'Modern Indian history, freedom struggle, Indian Constitution, resources, agriculture, industries.' },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'AISSEE Sainik School Entrance Examination Preparation (Class VI & IX)',
            description: 'Comprehensive residential coaching for All India Sainik Schools Entrance Examination (AISSEE) Class 6 & Class 9 in Amaravathinagar, Udumalpet.',
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Kalaivani Sainik RIMC Coaching Centre',
              sameAs: 'https://kalaivanisainikcoachingcentre.org.in',
            },
            courseCode: 'AISSEE-6-9',
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
          { label: 'Sainik School (AISSEE)' },
        ]}
      />

      {/* Hero Header */}
      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">AISSEE Comprehensive Preparation</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            All India Sainik Schools Entrance Examination (AISSEE)
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Specialized coaching for Class VI and Class IX admissions to the network of 33+ Sainik Schools across India. We deliver complete syllabus mastery, weekly OMR exam simulation, and personal mentorship.
          </p>
        </div>
      </section>

      {/* Overview & Highlights */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '48px', alignItems: 'center', marginBottom: '56px' }}>
            <div>
              <span className="section-eyebrow">Program Architecture</span>
              <h2 className="h2-title" style={{ marginBottom: '20px' }}>
                Structured Foundation for Class VI & IX Aspirants
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                The AISSEE exam conducted by the National Testing Agency (NTA) is purely OMR-based and tests high-speed calculation, reasoning, and conceptual depth. Our curriculum is engineered to build speed, eliminate negative anxiety, and instill disciplined problem-solving reflexes.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>10–12 Month Comprehensive Foundation Batch (April / June Intake)</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>90-Day High-Intensity Test Series & Revision (October – January)</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} />
                  <span style={{ fontSize: '0.95rem' }}>Separate boarding & supervision for both Boys & Girls</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--gold-primary)' }}>
              <h3 className="h3-title" style={{ marginBottom: '16px' }}>
                Key Eligibility Criteria (AISSEE)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Class VI Admission:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Candidate must be between <strong>10 and 12 years of age</strong> as on 31st March of the admission year. Both boys and girls are eligible.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Class IX Admission:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Candidate must be between <strong>13 and 15 years of age</strong> as on 31st March and should have passed Class VIII from a recognized school.
                  </p>
                </div>
                <div>
                  <strong style={{ color: 'var(--navy-primary)' }}>Exam Pattern:</strong>
                  <p style={{ color: 'var(--text-dark-muted)' }}>
                    Pen & Paper (OMR). Class VI: 300 Marks (125 MCQs, 150 mins). Class IX: 400 Marks (150 MCQs, 180 mins). No negative marking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Class 6 Syllabus Breakdown */}
          <div style={{ marginBottom: '56px' }}>
            <h3 className="h2-title" style={{ marginBottom: '8px' }}>
              Class VI Exam Pattern & Syllabus Breakdown (300 Marks)
            </h3>
            <p style={{ color: 'var(--text-dark-muted)', marginBottom: '24px' }}>
              Mathematics carries 50% of the entire exam weightage. Our curriculum provides daily 2-hour mathematics workshops.
            </p>
            <div className="grid-2" style={{ gap: '20px' }}>
              {class6Subjects.map((sub) => (
                <div key={sub.name} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                      {sub.name}
                    </h4>
                    <span className="badge badge-gold">{sub.marks}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                    {sub.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Class 9 Syllabus Breakdown */}
          <div style={{ marginBottom: '56px' }}>
            <h3 className="h2-title" style={{ marginBottom: '8px' }}>
              Class IX Exam Pattern & Syllabus Breakdown (400 Marks)
            </h3>
            <p style={{ color: 'var(--text-dark-muted)', marginBottom: '24px' }}>
              Rigorous coverage of advanced NCERT Class VIII concepts in Mathematics, Science, Social Studies, and Reasoning.
            </p>
            <div className="grid-3" style={{ gap: '20px' }}>
              {class9Subjects.map((sub) => (
                <div key={sub.name} className="card" style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                    {sub.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-dark)', marginBottom: '8px' }}>
                    {sub.marks}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)', lineHeight: '1.5' }}>
                    {sub.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Disclosure */}
          <div className="disclaimer-banner">
            <strong>Non-Affiliation Notice: </strong>
            Kalaivani Sainik RIMC Coaching Centre is an independent private educational tutorial centre. We prepare students for the AISSEE examination conducted by NTA. We do not represent the Sainik Schools Society or the Ministry of Defence, nor do we promise guaranteed admission.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Enquire About AISSEE Batches
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Reach out to our admission counsellors for diagnostic testing and seat reservation for 2026–2027.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="Sainik School Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

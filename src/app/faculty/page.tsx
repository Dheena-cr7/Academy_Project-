import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Award, BookOpen, Shield, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Faculty & Mentors | Kalaivani Sainik RIMC Coaching Centre',
  description:
    'Meet our senior faculty, defense mentors, and physical training instructors dedicated to student excellence in Amaravathinagar, Udumalpet.',
};

export default function FacultyPage() {
  const facultyList = [
    {
      name: 'K. Shanmugam, M.Sc., B.Ed.',
      role: 'Academic Director & Senior Mathematics Mentor',
      qualification: 'M.Sc. Mathematics, B.Ed. (22+ Years Teaching Experience)',
      specialization: 'AISSEE & RIMC Advanced Mathematics & Speed Arithmetic',
      bio: 'With over two decades of experience training students for national competitive entrance exams, Mr. Shanmugam specializes in breaking down complex multi-step mathematical problems into intuitive, concept-driven steps for young aspirants.',
    },
    {
      name: 'Capt. R. Venkatraman (Retd.)',
      role: 'Interview & Personality Development Advisor',
      qualification: 'B.A. Defense Studies, Former Services Officer',
      specialization: 'RIMC Viva-Voce, Communication Skills, & Leadership Orientation',
      bio: 'Brings authentic guidance on military school discipline, poise, positive communication, and mental stamina, conducting regular simulated interview panels for RIMC candidates.',
    },
    {
      name: 'P. Radhika, M.A., M.Phil.',
      role: 'Head of English & Verbal Reasoning',
      qualification: 'M.A. English Literature, M.Phil.',
      specialization: 'Descriptive English, Verbal Reasoning & Grammar',
      bio: 'Specialist in subjective English composition, critical essay structure, and comprehension techniques essential for RIMC and AISSEE entrance success.',
    },
    {
      name: 'Subedar Major T. Kumar (Retd.)',
      role: 'Physical Training & Drill Coordinator',
      qualification: 'Former Army Physical Training Instructor (PTI)',
      specialization: 'Stamina, Obstacle Navigation & Posture Training',
      bio: 'Oversees the daily morning physical conditioning, ensuring candidates build physical stamina, confidence, and agility in compliance with boarding school standards.',
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Faculty & Mentors' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Experienced Academic Leadership</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Faculty & Defence Mentors
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Our teaching team combines senior academic specialists with veteran armed forces officers to cultivate discipline, precision, and character.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '32px' }}>
            {facultyList.map((f) => (
              <div key={f.name} className="card" style={{ borderTop: '4px solid var(--gold-primary)', padding: '32px' }}>
                <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
                  {f.specialization}
                </span>
                <h2 className="h3-title" style={{ marginBottom: '4px' }}>
                  {f.name}
                </h2>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-primary)', marginBottom: '8px' }}>
                  {f.role}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--gold-dark)', fontWeight: 600, marginBottom: '16px' }}>
                  {f.qualification}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                  {f.bio}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '56px',
              backgroundColor: 'var(--ivory-light)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              border: '1px solid var(--ivory-muted)',
            }}
          >
            <h3 className="h3-title" style={{ marginBottom: '12px' }}>
              Our Teacher-Student Ratio & Mentorship Policy
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-dark-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
              We deliberately maintain small batch sizes (capped at 25–30 students per classroom) to ensure our mentors can review every child’s daily homework notebook, track weekly OMR test scores, and conduct 1-on-1 doubt clearing every evening.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-primary)' }}>
                <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} /> 1:15 Faculty-to-Cadet Attention
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-primary)' }}>
                <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} /> Weekly Diagnostic Scorecard
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-primary)' }}>
                <CheckCircle size={18} style={{ color: 'var(--gold-dark)' }} /> Personal Attention to Slow Learners
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Meet Our Faculty in Person
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Visit our Amaravathinagar campus and discuss your child’s preparation timeline directly with our mentors.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="Faculty Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

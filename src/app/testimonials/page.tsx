import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Quote, CheckCircle, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Parent & Cadet Reviews | Kalaivani Sainik Academy',
  description:
    'Read authentic testimonials from parents of admitted cadets at Sainik Schools, RIMC Dehradun, and Rashtriya Military Schools with verified consent.',
};

export default function TestimonialsPage() {
  const testimonials = [
    {
      author: 'P. Senthil Kumar (Parent)',
      role: 'Father of Cadet A. Vignesh (Sainik School Amaravathinagar, 2025)',
      year: '2025',
      message:
        'The disciplined routine, personal attention in mathematics, and weekly mock exams at Kalaivani Coaching Centre made all the difference for our son. The faculty kept us updated on his strengths and weak areas with complete honesty throughout the year. We are deeply grateful to Shanmugam Sir and the entire teaching staff.',
    },
    {
      author: 'Mrs. Kalavathi Balan (Parent)',
      role: 'Mother of Cadet K. Meenakshi (Class VI Girls Selection, 2024)',
      year: '2024',
      message:
        'As parents from a rural town near Tirupur, we were anxious about the fierce national competition for Sainik school girls’ seats. Kalaivani Academy provided a safe, motivating environment and exceptional hostel supervision. The wardens treated Meenakshi like family while maintaining strict study hours.',
    },
    {
      author: 'D. Ananthakrishnan',
      role: 'Alumnus - Currently Cadet at RMS Belgaum',
      year: '2024',
      message:
        'The morning PT drill and strict time-management practice gave me the edge I needed to clear the CET written exam and face the interview board without fear. Kalaivani gave me the character and foundation for military boarding life.',
    },
    {
      author: 'Col. K. R. Nambiar (Retd.)',
      role: 'Guardian of Cadet S. Harish (Sainik School Kazhakootam, 2025)',
      year: '2025',
      message:
        'Having served in the armed forces myself, I am very critical of commercial coaching institutes that make empty promises. Kalaivani stands out because their teaching methodology is genuinely disciplined, syllabus-aligned, and devoid of false marketing. Highly recommended for serious defense school aspirants.',
    },
    {
      author: 'M. Selvaraj (Parent)',
      role: 'Father of Cadet M. Pradeep (RMS Belgaum Selection, 2024)',
      year: '2024',
      message:
        'Pradeep was initially struggling with spatial intelligence and mathematical word problems. The dedicated evening faculty clinic and individual doubt solving helped him gain the confidence needed to clear the RMS test on his very first attempt.',
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Parent & Cadet Reviews' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Voices of Experience</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Parent & Cadet Testimonials
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Authentic experiences from families who entrusted us with their children’s preparation for Sainik School, RIMC, and RMS entrance tests.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '32px' }}>
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="card"
                style={{
                  borderTop: '4px solid var(--gold-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '32px',
                }}
              >
                <div>
                  <Quote size={28} style={{ color: 'var(--gold-dark)', marginBottom: '16px', opacity: 0.8 }} />
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '24px' }}>
                    &ldquo;{t.message}&rdquo;
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--ivory-muted)', paddingTop: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '4px' }}>
                    {t.author}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '8px' }}>
                    {t.role}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                    <ShieldCheck size={14} /> Verified Review with Parent Consent
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="disclaimer-banner" style={{ marginTop: '48px' }}>
            <strong>Consent & Privacy Note: </strong>
            All student and parent reviews displayed on this website have been collected with explicit consent. Names and quotes reflect personal experiences and do not constitute a legal guarantee of individual entrance examination results.
          </div>
        </div>
      </section>

      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Experience the Kalaivani Difference
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Schedule an appointment to speak with our alumni parents or visit our Amaravathinagar classrooms.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="Testimonials Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Shield, Target, Compass, Award, CheckCircle2, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Kalaivani Sainik RIMC Coaching Centre, Amaravathinagar',
  description:
    'Learn about our vision, teaching philosophy, and legacy in preparing students for AISSEE Sainik Schools, RIMC Dehradun, and RMS in Amaravathinagar, Udumalpet.',
};

export default function AboutPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: 'About Us' }]} />

      {/* Header Banner */}
      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Institutional Heritage</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Rooted in Discipline, Dedicated to Academic Excellence.
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '800px' }}>
            Founded in Amaravathinagar, Udumalpet, Kalaivani Sainik RIMC Coaching Centre provides focused residential and classroom guidance to train young minds for competitive entrance examinations to India’s premier boarding defense schools.
          </p>
        </div>
      </section>

      {/* Philosophy & Vision */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '56px' }}>
            <div>
              <span className="section-eyebrow">Our Mission & Approach</span>
              <h2 className="h2-title" style={{ marginBottom: '20px' }}>
                Developing Mind, Body & Character Simultaneously.
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                Gaining admission to a Sainik School, RIMC, or RMS requires more than memorising formulas—it demands spatial reasoning, emotional stability under pressure, quick analytical reflex, and physical endurance.
              </p>
              <p style={{ color: 'var(--text-dark-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                Our faculty consists of experienced educators and retired defense service personnel who understand the expectations of boarding school selection boards. We maintain an encouraging, family-like hostel atmosphere where every child is personally mentored, assessed, and guided.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: 'var(--ivory-light)', padding: '20px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gold-primary)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '6px' }}>
                    Academic Rigour
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
                    Daily problem-solving drills, weekly OMR simulations, and concept clarity across all exam papers.
                  </p>
                </div>

                <div style={{ backgroundColor: 'var(--ivory-light)', padding: '20px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--gold-primary)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '6px' }}>
                    Physical Stamina
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
                    Early morning obstacle training, running, and posture exercises overseen by veteran drill instructors.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <Image
                  src="/images/classroom_study_group.jpg"
                  alt="Disciplined academic classroom mentoring at Kalaivani Sainik Academy"
                  width={700}
                  height={466}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Context & Ethics */}
      <section className="section section-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="section-eyebrow">Institutional Integrity</span>
            <h2 className="h2-title" style={{ marginBottom: '16px' }}>
              Why Families Trust Kalaivani Coaching Centre
            </h2>
            <p className="lead-p">
              We believe in honest preparation, realistic parent feedback, and transparent communication.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <Shield size={28} style={{ color: 'var(--gold-dark)', marginBottom: '16px' }} />
              <h3 className="h3-title" style={{ marginBottom: '10px' }}>
                Independent Academic Tutoring
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                We are an independent coaching academy. We do not claim official government ties, official affiliation, or false quotas. Our only metric of success is the student’s genuine exam readiness.
              </p>
            </div>

            <div className="card">
              <Compass size={28} style={{ color: 'var(--gold-dark)', marginBottom: '16px' }} />
              <h3 className="h3-title" style={{ marginBottom: '10px' }}>
                Strategic Amaravathinagar Location
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                Located on the scenic Udumalpet–Munnar highway, our campus offers a calm, distraction-free environment immersed in natural beauty and fresh mountain air, ideal for intensive study.
              </p>
            </div>

            <div className="card">
              <Target size={28} style={{ color: 'var(--gold-dark)', marginBottom: '16px' }} />
              <h3 className="h3-title" style={{ marginBottom: '10px' }}>
                Tailored Co-Ed Training
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                Since AISSEE and RIMC now welcome girls, we provide dedicated hostel accommodations, separate supervision, and specialized coaching for female defense school aspirants.
              </p>
            </div>
          </div>

          <div className="disclaimer-banner" style={{ marginTop: '40px' }}>
            <strong>Official Transparency Notice: </strong>
            Kalaivani Sainik RIMC Coaching Centre is a preparatory tutorial centre and is not part of the Ministry of Defence, Sainik Schools Society, or RIMC Dehradun.
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Plan a Campus Visit in Amaravathinagar
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Parents are welcome to inspect our facilities, meet our director, and review past test materials.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="About Us Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

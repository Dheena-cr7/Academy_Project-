import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Camera, Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Campus & Training Gallery | Kalaivani Sainik Academy',
  description:
    'Visual tour of Kalaivani Sainik RIMC Coaching Centre campus in Amaravathinagar, Udumalpet: classrooms, drill grounds, library, and student activities.',
};

export default function GalleryPage() {
  const photos = [
    {
      title: 'Academy Campus & Western Ghats Vista',
      category: 'Campus Grounds',
      img: '/images/hero_campus_academy.jpg',
      alt: 'Exterior view of Kalaivani Sainik Academy campus nestled near the scenic foothills of the Western Ghats with manicured lawns and students in uniform blazers',
    },
    {
      title: 'Structured Classroom Mentoring Session',
      category: 'Academic Classroom',
      img: '/images/classroom_study_group.jpg',
      alt: 'Attentive students in uniform blazers taking notes while a senior mathematics educator explains geometry concepts on a chalkboard',
    },
    {
      title: 'Morning Physical Conditioning & Drill',
      category: 'Physical Training',
      img: '/images/physical_training_ground.jpg',
      alt: 'Cadets participating in stamina running, drill marching, and obstacle course agility training on the athletic ground during sunrise',
    },
    {
      title: 'Evening Library Self-Study Hall',
      category: 'Study Hall',
      img: '/images/library_study_hall.jpg',
      alt: 'Serene academic library with wooden study cubicles and motivated cadets reading reference books under warm desk lamps',
    },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Campus Gallery' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Visual Tour</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Campus & Training Life in Pictures
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            A glimpse into the daily life, academic dedication, and disciplined environment at our Amaravathinagar centre.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '32px' }}>
            {photos.map((p) => (
              <div
                key={p.title}
                className="card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    height: '340px',
                    backgroundColor: 'var(--navy-primary)',
                  }}
                >
                  <Image
                    src={p.img}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
                    {p.category}
                  </span>
                  <h3 className="h3-title" style={{ fontSize: '1.2rem', marginTop: '4px' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>
                    {p.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            See It In Person
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Our doors are open for parent campus visits Monday through Saturday.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="Gallery Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import { Shield, Clock, BookOpen, Heart, Coffee, Sun, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Campus Facilities & Boarding | Kalaivani Sainik Academy, Amaravathinagar',
  description:
    'Explore our Amaravathinagar campus, structured residential boarding, nutritious dining, physical training obstacle course, library, and cadet daily timetable.',
};

export default function FacilitiesPage() {
  const dailyRoutine = [
    { time: '05:30 AM', activity: 'Reveille & Morning Wash', desc: 'Cadets wake up, make their beds with military tidiness, and assemble for roll call.' },
    { time: '06:00 AM – 07:15 AM', activity: 'Physical Training (PT) & Running', desc: 'Warm-up stretching, 2 km stamina running, obstacle course agility, and drill under veteran PTI supervision.' },
    { time: '07:15 AM – 08:15 AM', activity: 'Shower & Wholesome Breakfast', desc: 'Nutritious South Indian breakfast (idli, pongal, eggs, milk, sprouts) designed for growing adolescents.' },
    { time: '08:30 AM – 10:30 AM', activity: 'Academic Session I: Mathematics', desc: 'Intensive problem-solving, formula retention, and speed calculation drills.' },
    { time: '10:30 AM – 10:45 AM', activity: 'Hydration & Fruit Break', desc: 'Short rest and seasonal fruit snack to refresh cognitive focus.' },
    { time: '10:45 AM – 01:00 PM', activity: 'Academic Session II: Reasoning & Science', desc: 'Non-verbal intelligence matrices, analogies, General Science and Social Studies modules.' },
    { time: '01:00 PM – 02:00 PM', activity: 'Balanced Lunch & Rest Period', desc: 'Hot, hygienic lunch followed by structured rest and power nap.' },
    { time: '02:00 PM – 04:30 PM', activity: 'Academic Session III: English & GK', desc: 'Grammar mechanics, vocabulary building, reading comprehension, and current affairs quiz.' },
    { time: '04:30 PM – 05:30 PM', activity: 'Evening Games & Recreation', desc: 'Volleyball, football, badminton, and outdoor sports on the academy ground.' },
    { time: '05:30 PM – 06:00 PM', activity: 'Evening Tea & Refreshments', desc: 'Tea, healthy snacks, and personal grooming time.' },
    { time: '06:00 PM – 08:30 PM', activity: 'Supervised Library Self-Study', desc: 'Quiet individual study hall with on-duty faculty available for one-on-one doubt clearing.' },
    { time: '08:30 PM – 09:15 PM', activity: 'Dinner & Dining Hall Etiquette', desc: 'Wholesome dinner and social interaction.' },
    { time: '09:15 PM – 09:45 PM', activity: 'News Review & Daily Diary', desc: 'Reading the daily newspaper and updating study progress journals.' },
    { time: '10:00 PM', activity: 'Lights Out & Restful Sleep', desc: 'Mandatory 7.5 hours of uninterrupted sleep for mental and physical recovery.' },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Facilities & Boarding' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Structured Campus Environment</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Campus Facilities & Residential Boarding
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Located in Amaravathinagar against the backdrop of the Western Ghats, our centre provides an ideal blend of rigorous academic classrooms, disciplined hostel living, and expansive physical training grounds.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '48px', alignItems: 'center', marginBottom: '64px' }}>
            <div>
              <span className="section-eyebrow">Academic Infrastructure</span>
              <h2 className="h2-title" style={{ marginBottom: '16px' }}>
                Modern, Focused Classrooms
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                Our classrooms are designed for active learning with ergonomic student desks, high ventilation, chalkboard and multimedia projection capabilities, and zero external distractions.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-dark-muted)' }}>
                <li>• Capped batch sizes (maximum 25–30 students) for individual focus</li>
                <li>• Individual student cubicles for evening supervised self-study</li>
                <li>• Curated textbook archive with 15 years of past entrance question papers</li>
                <li>• Regular full-length OMR test simulation rooms with biometric clock timing</li>
              </ul>
            </div>
            <div>
              <Image
                src="/images/classroom_study_group.jpg"
                alt="Well lit modern classroom with students engaged in mathematics lecture"
                width={700}
                height={466}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', height: 'auto', boxShadow: 'var(--shadow-card)' }}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '48px', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ order: 2 }}>
              <span className="section-eyebrow">Fitness & Character</span>
              <h2 className="h2-title" style={{ marginBottom: '16px' }}>
                Athletic Ground & Physical Training Course
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                Cadets train daily on our regulation running track and obstacle conditioning course. Under the watchful eye of retired military drill instructors, students develop the stamina, posture, and coordination required for medical board qualification.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-dark-muted)' }}>
                <li>• Running track, long-jump pit, and horizontal bars for chin-ups</li>
                <li>• Obstacle net climbing, wooden ramp scaling, and agility drills</li>
                <li>• Posture correction and military drill marching for ceremonial confidence</li>
                <li>• Daily medical monitoring and height/weight trajectory tracking</li>
              </ul>
            </div>
            <div style={{ order: 1 }}>
              <Image
                src="/images/physical_training_ground.jpg"
                alt="Students running and climbing obstacle course on athletic ground at sunrise"
                width={700}
                height={466}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', height: 'auto', boxShadow: 'var(--shadow-card)' }}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="section-eyebrow">Home Away From Home</span>
              <h2 className="h2-title" style={{ marginBottom: '16px' }}>
                Safe, Supervised Hostel & Nutritious Dining
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                We treat boarding as an extension of education. Separate secure hostel wings for boys and girls, 24/7 resident wardens, and disciplined hygiene ensure students stay healthy and focused throughout their stay.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-dark-muted)' }}>
                <li>• Separate residential wings for boys and girls with biometric access control</li>
                <li>• Four wholesome meals daily: Protein-rich breakfast, balanced lunch, evening tea, and dinner</li>
                <li>• Resident warden supervision and weekly parent telephone windows</li>
                <li>• Immediate first-aid clinic and doctor-on-call for medical care</li>
              </ul>
            </div>
            <div>
              <Image
                src="/images/library_study_hall.jpg"
                alt="Quiet study hall and reference library with warm wooden desks"
                width={700}
                height={466}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ borderRadius: 'var(--radius-md)', width: '100%', height: 'auto', boxShadow: 'var(--shadow-card)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cadet Daily Timetable */}
      <section className="section section-ivory">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="section-eyebrow">Discipline in Action</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              A Typical Day in the Life of a Cadet
            </h2>
            <p className="lead-p">
              Success is built through disciplined daily consistency. Here is how our residential boarders spend their day from reveille to lights out.
            </p>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Time Window</th>
                  <th style={{ width: '30%', color: 'var(--navy-primary)' }}>Cadet Activity</th>
                  <th style={{ width: '48%' }}>Educational & Training Focus</th>
                </tr>
              </thead>
              <tbody>
                {dailyRoutine.map((item) => (
                  <tr key={item.time}>
                    <td style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{item.time}</td>
                    <td style={{ fontWeight: 600, color: 'var(--gold-dark)' }}>{item.activity}</td>
                    <td style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Visit Our Amaravathinagar Campus
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Take an in-person tour of our hostel rooms, dining hall, and classrooms before making an admission decision.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="Facilities Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Clock,
  Sun,
  BookOpen,
  Award,
  Coffee,
  Moon,
  Activity,
  CheckCircle,
  Shield,
  Sparkles,
} from 'lucide-react';

export default function CadetDailyRoutine() {
  const [activeTab, setActiveTab] = useState<'weekday' | 'sunday' | 'fitness'>('weekday');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const weekdayRoutine = [
    {
      time: '05:30 AM',
      period: 'Morning Reveille',
      title: 'Wake Up & Cadets Assembly',
      desc: 'Bugle call, dormitory turnout, personal grooming, and reporting to the parade ground in academy PT kit.',
      icon: Sun,
      category: 'Discipline',
      color: '#071325',
    },
    {
      time: '06:00 AM – 07:15 AM',
      period: 'Physical Conditioning',
      title: 'Morning PT, 1.6 km Run & Obstacles',
      desc: 'Cadet endurance conditioning, stretching, beam balance, push-ups, chin-ups, and yoga exercises under ex-servicemen physical instructors.',
      icon: Activity,
      category: 'Physical Stamina',
      color: '#8b1e22',
    },
    {
      time: '07:30 AM – 08:15 AM',
      period: 'Nutrition & Turnout',
      title: 'Nutritious Cadet Mess Breakfast',
      desc: 'Hygienic, high-protein hot breakfast (milk, eggs/sprouts, idli/dosa/upma), uniform inspection for morning academic session.',
      icon: Coffee,
      category: 'Mess & Health',
      color: '#d4af37',
    },
    {
      time: '08:30 AM – 01:15 PM',
      period: 'Academic Session I',
      title: 'Core Mathematics & Deductive Reasoning',
      desc: 'High-focus concept classroom sessions covering NTA AISSEE syllabus, step-by-step problem solving, and language comprehension.',
      icon: BookOpen,
      category: 'Classroom Academics',
      color: '#0c1f38',
    },
    {
      time: '01:15 PM – 02:30 PM',
      period: 'Mid-Day Rest',
      title: 'Cadet Mess Lunch & Mandatory Rest',
      desc: 'Wholesome balanced hot lunch prepared on campus, supervised rest in dormitory to recharge mental sharpness.',
      icon: Coffee,
      category: 'Mess & Health',
      color: '#d4af37',
    },
    {
      time: '02:30 PM – 04:45 PM',
      period: 'Academic Session II',
      title: 'Speed Drills & Faculty Doubt Clearing',
      desc: 'Individual table doubt resolution, speed calculation shortcuts, General Knowledge & Current Affairs analysis.',
      icon: BookOpen,
      category: 'Classroom Academics',
      color: '#0c1f38',
    },
    {
      time: '05:00 PM – 06:15 PM',
      period: 'Evening Sports',
      title: 'Outdoor Games, Drill & Team Athletics',
      desc: 'Volleyball, football, badminton, and SSB obstacle course familiarity on our dedicated outdoor ground.',
      icon: Activity,
      category: 'Physical Stamina',
      color: '#8b1e22',
    },
    {
      time: '06:30 PM – 08:30 PM',
      period: 'Supervised Prep',
      title: 'Evening Study Hall & Daily OMR Practice',
      desc: 'Silent supervised study hall where every cadet practices time-bound OMR sheets under faculty invigilation.',
      icon: Award,
      category: 'OMR Test Clinic',
      color: '#071325',
    },
    {
      time: '08:30 PM – 10:00 PM',
      period: 'Night Rest',
      title: 'Dinner, News Analysis & Lights Out',
      desc: 'Nutritious dinner, national news review, Warden roll-call inspection, and lights out at 10:00 PM for 7.5 hours of recovery.',
      icon: Moon,
      category: 'Discipline',
      color: '#071325',
    },
  ];

  const sundayRoutine = [
    {
      time: '06:30 AM',
      period: 'Relaxed Reveille',
      title: 'Morning Yoga & Light Jog',
      desc: 'Gentle stretching, flexibility exercises, and peaceful morning yoga session.',
      icon: Sun,
      category: 'Physical Stamina',
      color: '#071325',
    },
    {
      time: '08:30 AM – 11:30 AM',
      period: 'Weekly Assessment',
      title: 'Full-Length NTA AISSEE / RIMC Mock Exam',
      desc: 'Strict 150-minute examination simulation with real OMR evaluation and immediate error diagnosis.',
      icon: Award,
      category: 'OMR Test Clinic',
      color: '#8b1e22',
    },
    {
      time: '12:00 PM – 01:30 PM',
      period: 'Special Lunch',
      title: 'Cadet Sunday Feast & Hostel Inspection',
      desc: 'Nutritious special meal, kit washing, and wardrobe inspection.',
      icon: Coffee,
      category: 'Mess & Health',
      color: '#d4af37',
    },
    {
      time: '02:00 PM – 04:30 PM',
      period: 'Personal Time',
      title: 'Parent Phone Calls & Personal Care',
      desc: 'Designated time for cadets to call parents, write letters, and read library books.',
      icon: Clock,
      category: 'Discipline',
      color: '#0c1f38',
    },
    {
      time: '05:00 PM – 07:00 PM',
      period: 'Mock Test Review',
      title: 'One-on-One Paper Error Analysis',
      desc: 'Subject teachers review each cadet’s Sunday test errors on the chalkboard.',
      icon: BookOpen,
      category: 'Classroom Academics',
      color: '#071325',
    },
    {
      time: '08:00 PM – 10:00 PM',
      period: 'Sunday Movie/Docu',
      title: 'Inspirational Defence Documentary & Rest',
      desc: 'Screening of Param Vir Chakra stories or historical documentaries followed by 10:00 PM lights out.',
      icon: Moon,
      category: 'Discipline',
      color: '#071325',
    },
  ];

  const fitnessStandards = [
    {
      activity: '1.6 km Endurance Run',
      standard: 'Under 8 Minutes (Class IX) / Under 9 Minutes (Class VI)',
      rationale: 'Builds cardiovascular endurance and mental tenacity under physical fatigue.',
    },
    {
      activity: 'Push-Ups & Sit-Ups',
      standard: '25 Consecutive Push-Ups, 30 Sit-Ups',
      rationale: 'Develops core and upper body strength required for cadet obstacle courses.',
    },
    {
      activity: 'Beam Balancing & Obstacles',
      standard: 'Full completion of 8 standard SSB ground obstacles',
      rationale: 'Fosters motor coordination, height confidence, and bodily agility.',
    },
    {
      activity: 'Parade Squad Drill',
      standard: 'Crisp marching, salute etiquette, and squad coordination',
      rationale: 'Instills military bearing, instant obedience to command, and teamwork.',
    },
  ];

  const currentRoutine = activeTab === 'weekday' ? weekdayRoutine : sundayRoutine;
  const filteredItems = filterCategory === 'all'
    ? currentRoutine
    : currentRoutine.filter((item) => item.category === filterCategory);

  const categories = ['all', 'Classroom Academics', 'Physical Stamina', 'OMR Test Clinic', 'Mess & Health', 'Discipline'];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid rgba(7, 19, 37, 0.08)',
        boxShadow: '0 10px 30px -4px rgba(7, 19, 37, 0.06)',
        padding: '36px',
      }}
    >
      {/* Top Header & Tab Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
          marginBottom: '28px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px',
        }}
      >
        <div>
          <span className="section-eyebrow">A Day in the Life of a Cadet</span>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.65rem',
              color: 'var(--academic-navy)',
              fontWeight: 700,
            }}
          >
            The 24-Hour Regimental Cadence
          </h3>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--ivory-light)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={() => { setActiveTab('weekday'); setFilterCategory('all'); }}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'weekday' ? 'var(--academic-navy)' : 'transparent',
              color: activeTab === 'weekday' ? '#ffffff' : 'var(--text-dark-muted)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Weekday Rigor
          </button>
          <button
            onClick={() => { setActiveTab('sunday'); setFilterCategory('all'); }}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'sunday' ? 'var(--academic-navy)' : 'transparent',
              color: activeTab === 'sunday' ? '#ffffff' : 'var(--text-dark-muted)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Sunday Assessment
          </button>
          <button
            onClick={() => setActiveTab('fitness')}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'fitness' ? 'var(--academic-navy)' : 'transparent',
              color: activeTab === 'fitness' ? '#ffffff' : 'var(--text-dark-muted)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Physical Standards
          </button>
        </div>
      </div>

      {/* Category Filter Pills (For Weekday and Sunday) */}
      {activeTab !== 'fitness' && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '6px 14px',
                fontSize: '0.785rem',
                fontWeight: 600,
                borderRadius: '9999px',
                border: filterCategory === cat ? '1px solid var(--academic-navy)' : '1px solid #cbd5e1',
                backgroundColor: filterCategory === cat ? 'var(--academic-navy)' : '#ffffff',
                color: filterCategory === cat ? '#ffffff' : 'var(--text-dark-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'all' ? 'All Activities' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Routine Cards Grid */}
      {activeTab !== 'fitness' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.time + idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '22px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--academic-gold)';
                  e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(7, 19, 37, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Accent top line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: item.color,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: 'var(--academic-navy)',
                      color: 'var(--academic-gold-light)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    <Clock size={12} />
                    {item.time}
                  </span>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-dark-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.period}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(7, 19, 37, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--academic-navy)',
                        marginBottom: '6px',
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-dark-muted)',
                        lineHeight: '1.6',
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Physical Standards Tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {fitnessStandards.map((fit, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--ivory-light)',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--academic-crimson)', marginBottom: '8px' }}>
                <Activity size={18} />
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--academic-navy)' }}>
                  {fit.activity}
                </h4>
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--academic-navy)',
                  backgroundColor: '#ffffff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '10px',
                }}
              >
                Benchmark: {fit.standard}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                {fit.rationale}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Quote Banner */}
      <div
        style={{
          marginTop: '32px',
          padding: '18px 24px',
          backgroundColor: 'var(--ivory-light)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--academic-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '0.875rem', color: 'var(--academic-navy)', fontStyle: 'italic' }}>
          "The timetable at Amaravathinagar is non-negotiable. Self-discipline in dawn PT translates into unshakable calm during a 150-minute NTA examination."
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
          — Physical Training Directorate
        </div>
      </div>
    </div>
  );
}

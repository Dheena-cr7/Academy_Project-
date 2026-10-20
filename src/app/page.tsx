'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle,
  Clock,
  ArrowRight,
  Phone,
  FileText,
  MapPin,
  Calendar,
  Activity,
  Check,
  Building,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle,
  Play,
  Quote,
  Star,
  ExternalLink,
} from 'lucide-react';
import CadetEligibilityCalculator from '@/components/CadetEligibilityCalculator';
import CadetDailyRoutine from '@/components/CadetDailyRoutine';
import DownloadProspectusModal from '@/components/DownloadProspectusModal';
import FaqAccordion from '@/components/FaqAccordion';
import AcademyVideoShowcase from '@/components/AcademyVideoShowcase';
import { trackEvent, getStoredUtmParameters } from '@/lib/analytics';

export default function HomePage() {
  const [isProspectusOpen, setIsProspectusOpen] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState<'sainik6' | 'sainik9' | 'rimc' | 'rms'>('sainik6');
  const [counts, setCounts] = useState({ years: 0, selections: 0, ratio: 0, boarding: 0 });

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1400;

    const updateCounts = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setCounts({
        years: Math.round(ease * 22),
        selections: Math.round(ease * 850),
        ratio: 15,
        boarding: Math.round(ease * 100),
      });

      if (progress < 1) {
        requestAnimationFrame(updateCounts);
      }
    };

    const frameId = requestAnimationFrame(updateCounts);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const [contactForm, setContactForm] = useState({
    parentName: '',
    phone: '',
    courseInterest: 'Sainik School (AISSEE)',
    studentClass: 'Class 5',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [refId, setRefId] = useState('');

  const phone = '+91 94437 18847';
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const whatsappUrl = `https://wa.me/919443718847?text=${encodeURIComponent(
    'Hello, I would like to enquire about admissions and the academic curriculum at Kalaivani Sainik RIMC Coaching Centre, Amaravathinagar.'
  )}`;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanInput = contactForm.phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanInput)) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!contactForm.parentName.trim()) {
      setFormError('Please enter parent or guardian name.');
      return;
    }

    setFormLoading(true);

    try {
      const utm = getStoredUtmParameters();
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: contactForm.parentName.trim(),
          phone: contactForm.phone.trim(),
          courseInterest: contactForm.courseInterest,
          message: `Current Standard: ${contactForm.studentClass} | Note: ${contactForm.message || 'General Admission Enquiry'}`,
          consentGiven: true,
          ...utm,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        trackEvent('enquiry_submission', {
          courseInterest: contactForm.courseInterest,
          studentClass: contactForm.studentClass,
        });
        setFormSubmitted(true);
        setRefId(data.enquiryId ? `KS-${String(data.enquiryId).padStart(5, '0')}` : 'KS-ADM2027');
      } else {
        setFormError(data.error || 'Failed to submit enquiry. Please call our admissions desk.');
      }
    } catch {
      setFormError('Network error. Please call our admissions desk at +91 94437 18847.');
    } finally {
      setFormLoading(false);
    }
  };

  const academicDisciplines = [
    {
      title: 'Conceptual Mathematics & Arithmetic',
      motto: 'Foundational Proofs, Number Sense & Speed Drills',
      desc: 'We teach mathematical concepts from first principles rather than rote shortcuts. Cadets master number theory, unitary methods, percentages, profit & loss, fractions, algebra, geometry, and mensuration. Weekly speed calculation workshops build numerical precision under timed exam conditions.',
      topics: ['Number Systems & Divisibility Proofs', 'Fractions, Decimals & Percentages', 'Algebraic Equations & Linear Problems', 'Geometry, Perimeter, Area & Volumes', 'Speed Arithmetic & Mental Math Drills'],
      icon: BookOpen,
      badge: 'Core Subject • 50% Exam Weightage',
    },
    {
      title: 'Intelligence & Analytical Reasoning',
      motto: 'Pattern Identification, Spatial Logic & Cognitive Agility',
      desc: 'Systematic daily practice in verbal and non-verbal reasoning. Students learn to decipher analogies, series completion, pattern matrices, spatial folding, coding-decoding, direction sense, and blood relations—developing sharp cognitive acuity required for NTA and RMS tests.',
      topics: ['Verbal Analogies & Classification', 'Non-Verbal Spatial Pattern Matrices', 'Series Completion & Number Grids', 'Coding-Decoding & Cryptic Logic', 'Timed OMR Pattern Practice'],
      icon: Compass,
      badge: 'Analytical Skill',
    },
    {
      title: 'English Language & Written Expression',
      motto: 'Grammatical Precision, Vocabulary & Précis Writing',
      desc: 'Rigorous language training emphasizing structural grammar, sentence syntax, active/passive voice, direct/indirect speech, idioms, and reading comprehension. For RIMC aspirants, faculty provide step-by-step guidance in formal précis writing, composition, and descriptive essay construction.',
      topics: ['Advanced Grammar Syntax & Rules', 'Vocabulary Building & Contextual Idioms', 'Reading Comprehension & Critical Analysis', 'Formal Précis Writing & Summaries (RIMC)', 'Descriptive Essay Construction'],
      icon: GraduationCap,
      badge: 'Language & Viva Voce',
    },
    {
      title: 'General Science & National Current Affairs',
      motto: 'Scientific Temper, History, Geography & Defence Knowledge',
      desc: 'A structured syllabus covering foundational physics, chemistry, biology, Indian history, geography, democratic institutions, and national defence achievements. Cadets participate in daily morning assembly discussions on national current events.',
      topics: ['Foundational General Science Concepts', 'Indian Geography & Environmental Studies', 'National History & Constitution Basics', 'Defence Establishments & Military Heritage', 'Daily Structured News Broadcast Review'],
      icon: Layers,
      badge: 'General Awareness',
    },
    {
      title: 'Physical Conditioning & Drill Discipline',
      motto: 'Endurance, Obstacle Familiarity & Military Bearing',
      desc: 'Academic excellence requires physical stamina. Under trained physical instructors and ex-servicemen, cadets undergo daily 05:30 AM morning conditioning, 1.6km running ground practice, SSB obstacle course navigation, squad drill coordination, and yoga.',
      topics: ['05:30 AM Reveille & Morning PT', '1.6km Timed Endurance Running', 'SSB Standard Obstacle Course Agility', 'Military Squad Drill & Posture Alignment', 'Yoga, Flexibility & Breathing Control'],
      icon: Activity,
      badge: 'Physical Standards',
    },
  ];

  const courseDetails = {
    sainik6: {
      title: 'Sainik School Entrance Examination (AISSEE Class VI)',
      standard: 'Class VI Admissions (Boys & Girls)',
      examAuthority: 'National Testing Agency (NTA)',
      examFormat: 'OMR Sheet Objective Examination (300 Marks, 150 Minutes)',
      eligibility: 'Candidate must be between 10 and 12 years of age as on 31st March of the admission year.',
      overview: 'Our Class VI foundational programme builds strong arithmetic calculation speed, abstract logical reasoning, grammatical language structure, and general science fundamentals. Includes weekly 150-minute NTA OMR test series simulating exact examination hall invigilation.',
      marksTable: [
        { subject: 'Mathematics', questions: 50, marksPerQ: 3, total: 150 },
        { subject: 'Intelligence', questions: 25, marksPerQ: 2, total: 50 },
        { subject: 'Language (English / Regional)', questions: 25, marksPerQ: 2, total: 50 },
        { subject: 'General Knowledge', questions: 25, marksPerQ: 2, total: 50 },
      ],
      totalMarks: 300,
      pedagogyHighlights: [
        'Daily 6 hours intensive academic lecture modules + 2.5 hours supervised prep',
        'Weekly full-length OMR mock examinations with individual negative-marking analysis',
        'Small batch cohorts (15:1 ratio) ensuring every child receives individual table attention',
        'Transparent guidance for medical test evaluation and official NTA e-counselling',
      ],
      href: '/courses/sainik-school',
    },
    sainik9: {
      title: 'Sainik School Entrance Examination (AISSEE Class IX)',
      standard: 'Class IX Admissions (Boys & Girls)',
      examAuthority: 'National Testing Agency (NTA)',
      examFormat: 'OMR Sheet Objective Examination (400 Marks, 180 Minutes)',
      eligibility: 'Candidate must be between 13 and 15 years as on 31st March and studying in or passed Class VIII.',
      overview: 'A high-rigor programme covering advanced CBSE Class VIII syllabus concepts. Focuses on algebraic expressions, geometric proofs, advanced mensuration, logical reasoning, chemical reactions, cell biology, and modern Indian history.',
      marksTable: [
        { subject: 'Mathematics', questions: 50, marksPerQ: 4, total: 200 },
        { subject: 'Intelligence', questions: 25, marksPerQ: 2, total: 50 },
        { subject: 'English Language', questions: 25, marksPerQ: 2, total: 50 },
        { subject: 'General Science', questions: 25, marksPerQ: 2, total: 50 },
        { subject: 'Social Studies', questions: 25, marksPerQ: 2, total: 50 },
      ],
      totalMarks: 400,
      pedagogyHighlights: [
        'Higher mathematics mastery: polynomials, exponents, factorisation, coordinate geometry',
        'Advanced scientific theory experiments and conceptual question drills',
        'Weekly 180-minute full-length NTA Class IX OMR examination series',
        'Supervised evening prep with dedicated mathematics faculty doubt resolution',
      ],
      href: '/courses/sainik-school',
    },
    rimc: {
      title: 'Rashtriya Indian Military College (RIMC Dehradun)',
      standard: 'Class VIII Entry (Bi-Annual Admissions)',
      examAuthority: 'Rashtriya Indian Military College / State Governments',
      examFormat: 'Subjective Written Examination (400 Marks) + Viva-Voce (50 Marks)',
      eligibility: 'Candidate must be between 11½ and 13 years of age and studying in or passed Class VII.',
      overview: 'RIMC is India’s premier feeder institution for the National Defence Academy. The examination is subjective and non-objective: candidates must write complete step-by-step mathematical proofs and formal English compositions. Our programme specializes in subjective proof writing, précis drafting, and interview board simulation.',
      marksTable: [
        { subject: 'Mathematics (Subjective Step-by-Step Proofs)', questions: 30, marksPerQ: 'Varies', total: 200 },
        { subject: 'English (Précis, Essay, Grammar, Comprehension)', questions: 'Descriptive', marksPerQ: 'Varies', total: 125 },
        { subject: 'General Knowledge (National & World Affairs)', questions: 75, marksPerQ: 1, total: 75 },
        { subject: 'Viva-Voce (Personality & Interview Panel)', questions: 'Interview', marksPerQ: 'Panel', total: 50 },
      ],
      totalMarks: 450,
      pedagogyHighlights: [
        'Subjective step-by-step mathematical proof evaluation with individual faculty corrections',
        'Weekly English essay and précis writing clinic with senior language masters',
        'Daily national news broadcast review and current affairs discussion in assembly',
        'Simulated mock interview panels with retired defence officers focusing on poise and communication',
      ],
      href: '/courses/rimc',
    },
    rms: {
      title: 'Rashtriya Military Schools (RMS Common Entrance Test)',
      standard: 'Class VI & Class IX Admissions',
      examAuthority: 'Directorate General of Military Training (DGMT)',
      examFormat: 'Common Entrance Test (CET) OMR Format + Interview',
      eligibility: 'Class VI: 10 to 12 Years | Class IX: 13 to 15 Years as on 31st March.',
      overview: 'Specialized preparation for admission into the five premier Rashtriya Military Schools (Chail, Ajmer, Belgaum, Bengaluru, Dholpur). Focuses on high-speed mental calculations, abstract intelligence puzzles, and personality refinement.',
      marksTable: [
        { subject: 'Intelligence & Reasoning', questions: 50, marksPerQ: 1, total: 50 },
        { subject: 'Mathematics', questions: 50, marksPerQ: 1, total: 50 },
        { subject: 'General Knowledge & Current Affairs', questions: 50, marksPerQ: 1, total: 50 },
        { subject: 'English Language (Qualifying)', questions: 50, marksPerQ: 1, total: 50 },
      ],
      totalMarks: 200,
      pedagogyHighlights: [
        'Speed calculation drills and shortcut elimination techniques for 200 questions',
        'Comprehensive English qualifying syllabus coaching',
        'Interview orientation and confidence-building workshops',
        'Physical training and obstacle familiarity on our dedicated outdoor grounds',
      ],
      href: '/courses/rms',
    },
  };

  const facultyMembers = [
    {
      role: 'Senior Academic Director & Mathematics Faculty',
      qualification: 'M.Sc (Mathematics), B.Ed • 20+ Years Mentorship',
      desc: 'Specialist in arithmetic foundations, geometry theorems, and step-by-step subjective problem solving for AISSEE and RIMC.',
    },
    {
      role: 'Faculty of Intelligence & Analytical Reasoning',
      qualification: 'M.Sc (Applied Statistics) • 14+ Years Experience',
      desc: 'Expert in competitive spatial logic, non-verbal pattern matrices, and speed decoding drills.',
    },
    {
      role: 'Senior Faculty of English Language & Composition',
      qualification: 'M.A (English Literature), M.Phil',
      desc: 'Focuses on grammatical precision, vocabulary enrichment, and RIMC précis & descriptive essay composition.',
    },
    {
      role: 'Physical Training Instructor & Drill Master',
      qualification: 'Ex-Serviceman (Indian Armed Forces)',
      desc: 'Conducts morning physical conditioning, 1.6km running endurance, squad drill, and SSB obstacle courses.',
    },
  ];

  const homeFaqs = [
    {
      id: 'faq-1',
      category: 'Admissions',
      question: 'What are the official age limits for Sainik School AISSEE Class VI and Class IX?',
      answer:
        'For Class VI admission, candidates must be between 10 and 12 years of age as on 31st March of the admission year (both boys and girls). For Class IX, candidates must be between 13 and 15 years as on 31st March and should have passed Class VIII from a recognized school. You can check your child’s exact eligibility using the calculator on this page.',
    },
    {
      id: 'faq-2',
      category: 'Institution',
      question: 'Is Kalaivani Sainik Coaching Centre officially run by the Government or Sainik School Amaravathinagar?',
      answer:
        'No. Kalaivani Sainik RIMC Coaching Centre is an independent, private preparatory coaching tutorial academy. It is located near State Bank of India, Amaravathinagar on Udumalpet–Munnar Road, but is completely separate from and NOT affiliated with the Ministry of Defence, Sainik Schools Society, or any military establishment.',
    },
    {
      id: 'faq-3',
      category: 'Boarding',
      question: 'Are boarding and food facilities provided for outstation students?',
      answer:
        'Yes. We offer fully supervised residential boarding with nutritious meals, dedicated study desks, round-the-clock hostel warden supervision, and daily morning physical fitness training on our campus grounds.',
    },
    {
      id: 'faq-4',
      category: 'Batches',
      question: 'How do I enrol or enquire about upcoming batches?',
      answer:
        'You can inspect our curriculum on this page, submit an academic enquiry below, call our admissions desk at +91 94437 18847, or visit our centre near State Bank of India, Amaravathinagar during office hours (Monday to Saturday, 08:30 AM to 06:30 PM).',
    },
  ];

  const currentCourse = courseDetails[activeCourseTab];

  return (
    <div>
      {/* 1. Cinematic Grand Academic Hero */}
      <section className="academic-hero-container">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            {/* Heraldic Credo Ribbon */}
            <div
              className="hero-floating-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: 'var(--academic-gold-light)',
                padding: '6px 18px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '26px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Shield size={14} style={{ color: 'var(--academic-gold)' }} />
              <span>Amaravathinagar, Udumalpet • Est. 2004 • Premier Residential Tutorial</span>
            </div>

            {/* Master Headline */}
            <h1
              className="h1-hero-light"
              style={{
                marginBottom: '24px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              Disciplined Minds. Unwavering Character.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #fdf2cf 0%, #d4af37 50%, #f7e2a4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Exceptional Leaders.
              </span>
            </h1>

            {/* Editorial Lead Narrative */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                color: '#e2e8f0',
                lineHeight: '1.75',
                marginBottom: '38px',
                maxWidth: '820px',
                margin: '0 auto 38px auto',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
              }}
            >
              A specialized residential preparatory tutorial guiding young students for admission into All India Sainik Schools (AISSEE), Rashtriya Indian Military College (RIMC) Dehradun, and Rashtriya Military Schools (RMS). Grounded in conceptual mathematics, analytical reasoning, and moral discipline.
            </p>

            {/* Balanced Luxury Hero Action Bar */}
            <div className="hero-actions-bar">
              <a
                href="#academic-framework"
                className="btn-gold-action"
              >
                <span>Explore Academic Curriculum ↓</span>
              </a>

              <a
                href="#academy-videos"
                className="btn-hero-video"
              >
                <Play size={16} fill="#ffffff" />
                <span>Watch Cadet Life Reel</span>
              </a>

              <button
                onClick={() => setIsProspectusOpen(true)}
                className="btn-hero-glass"
              >
                <FileText size={16} style={{ color: 'var(--academic-gold-light)' }} />
                <span>Prospectus (PDF)</span>
              </button>
            </div>

            {/* Four Frosted Glass Trust Dossiers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                maxWidth: '960px',
                margin: '0 auto',
              }}
              className="hero-trust-grid"
            >
              <div className="academic-stat-glass scroll-zoom-in stagger-1">
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--academic-gold-light)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  {counts.years || 22}+ Yrs
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px', fontWeight: 600 }}>
                  Senior Faculty Mentorship
                </div>
              </div>

              <div className="academic-stat-glass scroll-zoom-in stagger-2">
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--academic-gold-light)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  {counts.selections || 850}+
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px', fontWeight: 600 }}>
                  Documented Cadet Selections
                </div>
              </div>

              <div className="academic-stat-glass scroll-zoom-in stagger-3">
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--academic-gold-light)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  15 : 1
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px', fontWeight: 600 }}>
                  Classroom Cohort Ratio
                </div>
              </div>

              <div className="academic-stat-glass scroll-zoom-in stagger-4">
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--academic-gold-light)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  {counts.boarding || 100}%
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px', fontWeight: 600 }}>
                  Supervised Boarding Cadence
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Institutional Heritage & Statutory Transparency Strip */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(139, 30, 34, 0.1)',
                  color: 'var(--academic-crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Shield size={18} />
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)' }}>
                <strong style={{ color: 'var(--academic-navy)' }}>Institutional Notice:</strong> Independent preparatory tutorial academy. Not affiliated with the Ministry of Defence or Sainik Schools Society.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--academic-navy)', fontWeight: 600 }}>
                <MapPin size={16} style={{ color: 'var(--academic-crimson)' }} />
                <span>Near State Bank of India, Amaravathinagar, Udumalpet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Academic Philosophy & Pedagogy (How We Teach) */}
      <section id="academic-framework" className="section" style={{ backgroundColor: '#ffffff', scrollMarginTop: '80px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.25fr)',
              gap: '52px',
              alignItems: 'center',
              marginBottom: '72px',
            }}
            className="hero-grid"
          >
            {/* Left: Seminar Hall Photo & Photo Badge */}
            <div className="scroll-fade-left">
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(7, 19, 37, 0.1)',
                  boxShadow: '0 20px 48px -10px rgba(7, 19, 37, 0.15)',
                  position: 'relative',
                }}
              >
                <img
                  src="/images/faculty_seminar_class.jpg"
                  alt="Senior academic master explaining mathematical theorem and geometric proofs to cadets at Kalaivani Sainik Academy"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '14px',
                  padding: '12px 18px',
                  backgroundColor: 'var(--ivory-light)',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  color: 'var(--text-dark-muted)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--academic-navy)' }}>
                  Classroom Lecture Hall • Mathematics & Proof Workshop
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    color: 'var(--academic-gold-dark)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  Cohort Ratio: 15:1
                </span>
              </div>
            </div>

            {/* Right: Academic Vision & Pedagogy */}
            <div className="scroll-fade-right">
              <span className="section-eyebrow" style={{ color: 'var(--academic-crimson)' }}>
                Educational Philosophy
              </span>
              <h2 className="h2-title" style={{ marginBottom: '18px' }}>
                How We Teach: First Principles, Proofs & Cognitive Rigor
              </h2>
              <p className="lead-p" style={{ marginBottom: '16px' }}>
                Competitive military school entrance examinations do not reward superficial shortcut tricks. The National Testing Agency (AISSEE) and RIMC Dehradun evaluate conceptual depth, deductive clarity, and mental stamina under timed pressure.
              </p>
              <p style={{ color: 'var(--text-dark-muted)', lineHeight: '1.75', marginBottom: '28px', fontSize: '0.95rem' }}>
                Our teaching philosophy rests on strong conceptual foundations in Mathematics, extensive vocabulary building, daily physical fitness, and moral discipline. We teach students how to think clearly under timed pressure, solve multi-step problems with accuracy, and face entrance interviews with natural poise.
              </p>

              {/* 3 Numbered Pedagogical Pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(7, 19, 37, 0.06)',
                      border: '1px solid rgba(7, 19, 37, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: 'var(--academic-navy)',
                      flexShrink: 0,
                    }}
                  >
                    01
                  </div>
                  <div>
                    <strong style={{ color: 'var(--academic-navy)', fontSize: '0.95rem' }}>
                      Step-by-Step Proofs Before Shortcuts:
                    </strong>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginTop: '2px', lineHeight: '1.5' }}>
                      Cadets master theorem origins and algebraic derivations before applying speed calculation techniques.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(7, 19, 37, 0.06)',
                      border: '1px solid rgba(7, 19, 37, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: 'var(--academic-navy)',
                      flexShrink: 0,
                    }}
                  >
                    02
                  </div>
                  <div>
                    <strong style={{ color: 'var(--academic-navy)', fontSize: '0.95rem' }}>
                      Small Cohort Batches (15:1 Ratio):
                    </strong>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginTop: '2px', lineHeight: '1.5' }}>
                      Maximum 15 to 20 students per classroom ensuring individual table doubt resolution and personalized study plans.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(7, 19, 37, 0.06)',
                      border: '1px solid rgba(7, 19, 37, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: 'var(--academic-navy)',
                      flexShrink: 0,
                    }}
                  >
                    03
                  </div>
                  <div>
                    <strong style={{ color: 'var(--academic-navy)', fontSize: '0.95rem' }}>
                      Weekly Full-Length OMR Simulations:
                    </strong>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginTop: '2px', lineHeight: '1.5' }}>
                      Exact 150-minute exam hall invigilation eliminating bubbling mistakes, question skipping anxiety, and negative marking panic.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Core Academic Disciplines Breakdown */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }} className="scroll-fade-up">
            <span className="section-eyebrow">Curriculum Framework</span>
            <h3 className="h2-title" style={{ marginBottom: '12px' }}>
              The Five Core Academic Pillars
            </h3>
            <p className="lead-p">
              Every preparatory day is structured across these rigorous academic modules.
            </p>
          </div>

          <div className="academic-pillars-grid">
            {academicDisciplines.map((item, idx) => {
              const Icon = item.icon;
              const isLastPillar = idx === academicDisciplines.length - 1;
              return (
                <div
                  key={idx}
                  className="scroll-fade-up academic-card-lift"
                  style={{
                    gridColumn: isLastPillar ? '1 / -1' : undefined,
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(7, 19, 37, 0.08)',
                    borderRadius: '16px',
                    padding: isLastPillar ? '36px' : '30px',
                    boxShadow: '0 8px 24px -4px rgba(7, 19, 37, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: isLastPillar
                        ? 'linear-gradient(90deg, var(--academic-crimson), var(--academic-gold))'
                        : 'linear-gradient(90deg, var(--academic-navy), var(--academic-gold))',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px',
                        marginBottom: '18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(7, 19, 37, 0.04)',
                            color: 'var(--academic-navy)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(7, 19, 37, 0.1)',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={24} style={{ color: 'var(--academic-crimson)' }} />
                        </div>
                        <div>
                          <h4
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: 'var(--academic-navy)',
                              margin: 0,
                              lineHeight: 1.25,
                            }}
                          >
                            {item.title}
                          </h4>
                          <div style={{ fontSize: '0.8rem', color: 'var(--academic-crimson)', fontWeight: 600, marginTop: '2px' }}>
                            {item.motto}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.12)',
                          color: 'var(--academic-navy)',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.925rem', color: 'var(--text-dark-muted)', lineHeight: '1.7', marginBottom: '22px' }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'var(--ivory-light)', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: 'auto' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--academic-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                      Key Modules Covered in Curriculum:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {item.topics.map((t, tidx) => (
                        <span
                          key={tidx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: 'var(--academic-navy)',
                          }}
                        >
                          <Check size={12} style={{ color: 'var(--academic-crimson)' }} />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Section: Interactive Academic Course & Syllabus Explorer */}
      <section id="programmes" className="section" style={{ backgroundColor: 'var(--ivory-light)', scrollMarginTop: '80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 44px' }}>
            <span className="section-eyebrow">Curriculum Explorer</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              Examination Programmes & Official Marking Syllabi
            </h2>
            <p className="lead-p">
              Select an entrance programme below to inspect its official testing format, subject weightages, and classroom schedule.
            </p>
          </div>

          {/* Academic Tab Switcher */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '36px',
            }}
          >
            <button
              onClick={() => setActiveCourseTab('sainik6')}
              className={`academic-tab-btn ${activeCourseTab === 'sainik6' ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>AISSEE Sainik School (Class VI)</span>
            </button>

            <button
              onClick={() => setActiveCourseTab('sainik9')}
              className={`academic-tab-btn ${activeCourseTab === 'sainik9' ? 'active' : ''}`}
            >
              <GraduationCap size={16} />
              <span>AISSEE Sainik School (Class IX)</span>
            </button>

            <button
              onClick={() => setActiveCourseTab('rimc')}
              className={`academic-tab-btn ${activeCourseTab === 'rimc' ? 'active' : ''}`}
            >
              <Award size={16} />
              <span>RIMC Dehradun (Class VIII)</span>
            </button>

            <button
              onClick={() => setActiveCourseTab('rms')}
              className={`academic-tab-btn ${activeCourseTab === 'rms' ? 'active' : ''}`}
            >
              <Shield size={16} />
              <span>Rashtriya Military Schools (RMS)</span>
            </button>
          </div>

          {/* Active Course Detailed Card */}
          <div
            key={activeCourseTab}
            className="academic-tab-content-active scroll-zoom-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(7, 19, 37, 0.08)',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 12px 36px -6px rgba(7, 19, 37, 0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '24px',
              }}
            >
              <div>
                <span
                  style={{
                    backgroundColor: 'rgba(7, 19, 37, 0.05)',
                    color: 'var(--academic-navy)',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.785rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  {currentCourse.standard}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.85rem',
                    fontWeight: 700,
                    color: 'var(--academic-navy)',
                    marginTop: '10px',
                    marginBottom: '6px',
                  }}
                >
                  {currentCourse.title}
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)' }}>
                  Conducting Authority: <strong>{currentCourse.examAuthority}</strong> • Examination Format: <strong>{currentCourse.examFormat}</strong>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--ivory-light)',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  color: 'var(--academic-navy)',
                  maxWidth: '380px',
                }}
              >
                <strong>Eligibility Criteria:</strong> {currentCourse.eligibility}
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-dark)', lineHeight: '1.75', marginBottom: '32px' }}>
              {currentCourse.overview}
            </p>

            {/* Subject-Wise Marks Breakdown Table */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--academic-navy)', marginBottom: '14px' }}>
                Official Examination Pattern & Subject Weightages:
              </h4>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Examination Subject</th>
                      <th>Questions</th>
                      <th>Marks per Question</th>
                      <th>Total Subject Weightage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCourse.marksTable.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td style={{ fontWeight: 600, color: 'var(--academic-navy)' }}>{row.subject}</td>
                        <td style={{ color: 'var(--text-dark-muted)' }}>{row.questions}</td>
                        <td style={{ color: 'var(--text-dark-muted)' }}>{row.marksPerQ}</td>
                        <td style={{ fontWeight: 700, color: 'var(--academic-navy)' }}>{row.total}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>
                      <td colSpan={3} style={{ color: 'var(--academic-navy)', fontSize: '1rem' }}>Total Maximum Examination Marks</td>
                      <td style={{ color: 'var(--academic-crimson)', fontSize: '1.1rem' }}>{currentCourse.totalMarks} Marks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pedagogy Highlights */}
            <div style={{ backgroundColor: 'var(--ivory-light)', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--academic-navy)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                Academic Delivery & Mentorship Process:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                {currentCourse.pedagogyHighlights.map((pt, pIdx) => (
                  <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.925rem', color: 'var(--text-dark)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--academic-crimson)', flexShrink: 0, marginTop: '3px' }} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <Link href={currentCourse.href} className="btn btn-primary">
                <span>Read Full Course Curriculum Page →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: Academy Life in Motion & Video Documentary Reel */}
      <AcademyVideoShowcase />

      {/* 6. Section: The 24-Hour Cadet Timetable */}
      <section id="cadet-schedule" className="section" style={{ backgroundColor: '#ffffff', scrollMarginTop: '80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px' }} className="scroll-fade-up">
            <span className="section-eyebrow">Cadet Routine</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              The 24-Hour Academic & Boarding Schedule
            </h2>
            <p className="lead-p">
              Discipline is the foundation of academic success. See how our residential cadets balance physical fitness, classroom concentration, supervised study hall, and adequate sleep.
            </p>
          </div>

          <div className="scroll-fade-up stagger-1">
            <CadetDailyRoutine />
          </div>
        </div>
      </section>

      {/* 7. Section: Academic Faculty & Master Mentors */}
      <section className="section" style={{ backgroundColor: 'var(--ivory-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }} className="scroll-fade-up">
            <span className="section-eyebrow">Instructional Staff</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              Academic Mentors & Instructors
            </h2>
            <p className="lead-p">
              Experienced subject masters dedicated to small cohorts, concept proofs, individual doubt solving, and military physical conditioning.
            </p>
          </div>

          <div className="grid-4" style={{ gap: '24px' }}>
            {facultyMembers.map((fac, idx) => (
              <div
                key={idx}
                className={`scroll-fade-up academic-card-lift stagger-${(idx % 4) + 1}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '28px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(7, 19, 37, 0.05)',
                      color: 'var(--academic-navy)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Users size={22} style={{ color: 'var(--academic-crimson)' }} />
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--academic-navy)',
                      marginBottom: '4px',
                      lineHeight: '1.3',
                    }}
                  >
                    {fac.role}
                  </h4>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--academic-crimson)', marginBottom: '12px' }}>
                    {fac.qualification}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', lineHeight: '1.6' }}>
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }} className="scroll-fade-up">
            <Link href="/faculty" className="btn btn-secondary">
              View Detailed Faculty Directory & Credentials →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Section: Architectural Campus & Learning Spaces Mosaic Grid */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }} className="scroll-fade-up">
            <span className="section-eyebrow">Campus Learning Spaces</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              Academic Learning Spaces & Infrastructure
            </h2>
            <p className="lead-p">
              Located on the Udumalpet–Munnar Road near State Bank of India, our campus provides purposeful learning spaces designed for continuous preparation.
            </p>
          </div>

          <div className="grid-4" style={{ gap: '24px' }}>
            <div className="mosaic-card scroll-fade-up stagger-1">
              <div className="mosaic-img-wrap">
                <img
                  src="/images/classroom_study_group.jpg"
                  alt="Smart classrooms with individual desks"
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--academic-navy)', marginBottom: '4px', fontWeight: 700 }}>
                  Academic Classrooms
                </h5>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)', lineHeight: '1.55' }}>
                  Acoustic lecture rooms with individual seating and whiteboard theorem practice.
                </p>
              </div>
            </div>

            <div className="mosaic-card scroll-fade-up stagger-2">
              <div className="mosaic-img-wrap">
                <img
                  src="/images/physical_training_ground.jpg"
                  alt="Physical training ground and obstacles"
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--academic-navy)', marginBottom: '4px', fontWeight: 700 }}>
                  PT Ground & Obstacles
                </h5>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)', lineHeight: '1.55' }}>
                  Standard SSB obstacles and 1.6km track for physical endurance and squad drill.
                </p>
              </div>
            </div>

            <div className="mosaic-card scroll-fade-up stagger-3">
              <div className="mosaic-img-wrap">
                <img
                  src="/images/library_study_hall.jpg"
                  alt="Evening study hall and OMR clinic"
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--academic-navy)', marginBottom: '4px', fontWeight: 700 }}>
                  Supervised Study Hall
                </h5>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)', lineHeight: '1.55' }}>
                  Dedicated evening desks with faculty invigilation and doubt clearance.
                </p>
              </div>
            </div>

            <div className="mosaic-card scroll-fade-up stagger-4">
              <div className="mosaic-img-wrap">
                <img
                  src="/images/majestic_academy_campus.jpg"
                  alt="Academy campus exterior and mountain foothills"
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--academic-navy)', marginBottom: '4px', fontWeight: 700 }}>
                  Amaravathinagar Campus
                </h5>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)', lineHeight: '1.55' }}>
                  Residential boarding wings with 24/7 warden supervision and nutritious dining mess.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Section: Documented Results & Cadet Selections */}
      <section className="section" style={{ backgroundColor: 'var(--ivory-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }} className="scroll-fade-up">
            <span className="section-eyebrow">Documented Record</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              Documented Cadet Achievements
            </h2>
            <p className="lead-p">
              Real candidates from our academy who cleared competitive examinations and secured admission to Sainik Schools and RIMC.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '28px' }}>
            <div className="scroll-fade-up academic-card-lift stagger-1" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '28px', borderTop: '3px solid #059669', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Award size={18} style={{ color: '#059669' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                  AISSEE 2025 Selection
                </span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--academic-navy)', marginBottom: '4px', fontWeight: 700 }}>
                Cadet K. Vignesh
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '14px' }}>
                Admitted to <strong>Sainik School Amaravathinagar</strong> (Class VI) • Score: 268/300
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: '1.65', fontStyle: 'italic' }}>
                "The weekly full-length OMR test drills helped Vignesh overcome exam anxiety and manage calculation speed." — <em>Parent Feedback, Udumalpet</em>
              </p>
            </div>

            <div className="scroll-fade-up academic-card-lift stagger-2" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '28px', borderTop: '3px solid #059669', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Award size={18} style={{ color: '#059669' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                  AISSEE 2024 Selection
                </span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--academic-navy)', marginBottom: '4px', fontWeight: 700 }}>
                Cadet R. Dharanidharan
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '14px' }}>
                Admitted to <strong>Sainik School Kazhakootam</strong> (Class VI)
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: '1.65', fontStyle: 'italic' }}>
                "Hostel routine and early morning physical conditioning gave him focus and study stamina." — <em>Parent Feedback, Coimbatore</em>
              </p>
            </div>

            <div className="scroll-fade-up academic-card-lift stagger-3" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '28px', borderTop: '3px solid #7c3aed', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Award size={18} style={{ color: '#7c3aed' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                  RIMC Qualified
                </span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--academic-navy)', marginBottom: '4px', fontWeight: 700 }}>
                Cadet M. Anirudh
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '14px' }}>
                Selected for <strong>RIMC Dehradun Viva-Voce Interview</strong>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: '1.65', fontStyle: 'italic' }}>
                "Subjective math proofs and English précis guidance were essential for clearing the RIMC written exam." — <em>Parent Feedback, Pollachi</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Section: Interactive Cadet Eligibility Calculator */}
      <section id="eligibility-calculator" className="section" style={{ backgroundColor: '#ffffff', scrollMarginTop: '80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }} className="scroll-fade-up">
            <span className="section-eyebrow">Statutory Criteria</span>
            <h2 className="h2-title" style={{ marginBottom: '12px' }}>
              Check Your Child’s Official Entrance Eligibility
            </h2>
            <p className="lead-p">
              Verify your child’s date of birth strictly against NTA and RIMC guidelines for the upcoming 2026–2027 academic session.
            </p>
          </div>

          <div className="scroll-fade-up stagger-1">
            <CadetEligibilityCalculator />
          </div>
        </div>
      </section>

      {/* 11. Section: Admissions Desk & Campus Visit Enquiry */}
      <section
        id="admissions-contact"
        className="section"
        style={{
          backgroundColor: 'var(--ivory-light)',
          borderTop: '1px solid #e2e8f0',
          scrollMarginTop: '80px',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 52px' }} className="scroll-fade-up">
            <span className="section-eyebrow">Admissions Office</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              Admission Enquiry & Campus Visit
            </h2>
            <p className="lead-p">
              We welcome parents to visit our Amaravathinagar campus, inspect classrooms and hostels, and discuss their child’s academic induction.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
              gap: '48px',
              alignItems: 'flex-start',
            }}
            className="hero-grid"
          >
            {/* Left: Campus Information & Direct Details */}
            <div className="scroll-fade-left">
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '36px',
                  boxShadow: '0 8px 24px -4px rgba(7, 19, 37, 0.06)',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--academic-navy)',
                    marginBottom: '18px',
                  }}
                >
                  Campus Location & Office Timings
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <MapPin size={20} style={{ color: 'var(--academic-crimson)', flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <strong style={{ color: 'var(--academic-navy)' }}>Physical Address:</strong><br />
                      Kalaivani Sainik RIMC Coaching Centre<br />
                      Near State Bank of India, Amaravathinagar,<br />
                      Udumalpet–Munnar Road, Amaravathi, Tamil Nadu 642102.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <Clock size={20} style={{ color: 'var(--academic-crimson)', flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <strong style={{ color: 'var(--academic-navy)' }}>Office Working Hours:</strong><br />
                      Monday to Saturday: 08:30 AM to 06:30 PM<br />
                      Sunday: By prior parent appointment
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <Phone size={20} style={{ color: 'var(--academic-crimson)', flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <strong style={{ color: 'var(--academic-navy)' }}>Direct Telephone:</strong><br />
                      <a href={`tel:${cleanPhone}`} style={{ color: 'var(--academic-navy)', fontWeight: 700, textDecoration: 'none' }}>
                        {phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
                  <a
                    href="https://www.google.com/maps/place/Kalaivani+Sainik+RIMC+Coaching+Centre/@10.4389671,77.25874,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9d46d0ff1cfc9:0xe56e603aa6762c8a!8m2!3d10.4389671!4d77.2613149!16s%2Fg%2F11c7t40964?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <MapPin size={15} />
                    <span>Google Maps Directions</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Statutory Notice */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderLeft: '4px solid var(--academic-crimson)',
                  borderRadius: '0 8px 8px 0',
                  padding: '18px 22px',
                  fontSize: '0.85rem',
                  color: 'var(--text-dark-muted)',
                  lineHeight: '1.65',
                  border: '1px solid #e2e8f0',
                  borderLeftWidth: '4px',
                }}
              >
                <strong style={{ color: 'var(--academic-navy)' }}>Institutional Notice:</strong> Kalaivani Sainik RIMC Coaching Centre is an independent private coaching tutorial. It is NOT affiliated with, authorized by, or endorsed by the Ministry of Defence, Sainik Schools Society, RIMC Dehradun, or Rashtriya Military Schools.
              </div>
            </div>

            {/* Right: Dignified Enquiry Form */}
            <div
              className="scroll-fade-right"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '36px',
                boxShadow: '0 8px 24px -4px rgba(7, 19, 37, 0.06)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--academic-navy)',
                  marginBottom: '6px',
                }}
              >
                Send an Academic Enquiry
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginBottom: '22px' }}>
                Please share your details. Our academic counsellor will review and provide information regarding batch schedules and hostel arrangements.
              </p>

              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '28px 0' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                      border: '2px solid #a7f3d0',
                    }}
                  >
                    <CheckCircle size={30} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--academic-navy)', marginBottom: '6px' }}>
                    Enquiry Registered Successfully
                  </h4>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--academic-navy)', marginBottom: '14px' }}>
                    Official Reference Number: {refId}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', lineHeight: '1.65' }}>
                    Thank you. We have registered your enquiry for <strong>{contactForm.parentName}</strong>. Our admissions desk at Amaravathinagar will contact you with batch syllabus details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  {formError && (
                    <div
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#b91c1c',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        marginBottom: '16px',
                        border: '1px solid #fecaca',
                      }}
                    >
                      {formError}
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--academic-navy)', marginBottom: '6px' }}>
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Murugesan"
                      value={contactForm.parentName}
                      onChange={(e) => setContactForm({ ...contactForm, parentName: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--academic-navy)', marginBottom: '6px' }}>
                      Contact Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 94437 18847"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--academic-navy)', marginBottom: '6px' }}>
                        Target Programme
                      </label>
                      <select
                        value={contactForm.courseInterest}
                        onChange={(e) => setContactForm({ ...contactForm, courseInterest: e.target.value })}
                        className="form-select"
                      >
                        <option value="Sainik School (AISSEE)">Sainik School (AISSEE)</option>
                        <option value="RIMC Dehradun">RIMC Dehradun (Class VIII)</option>
                        <option value="Rashtriya Military Schools (RMS)">Rashtriya Military Schools</option>
                        <option value="Summer Foundation">Summer Foundation Batch</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--academic-navy)', marginBottom: '6px' }}>
                        Student's Current Class
                      </label>
                      <select
                        value={contactForm.studentClass}
                        onChange={(e) => setContactForm({ ...contactForm, studentClass: e.target.value })}
                        className="form-select"
                      >
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--academic-navy)', marginBottom: '6px' }}>
                      Enquiry Note / Specific Questions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Inquiring regarding Class 6 residential hostel admission for 2027..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}
                  >
                    {formLoading ? 'Submitting Enquiry...' : 'Submit Academic Enquiry →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 12. Frequently Asked Questions */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px' }}>
            <span className="section-eyebrow">Information for Parents</span>
            <h2 className="h2-title" style={{ marginBottom: '14px' }}>
              Frequently Asked Questions
            </h2>
            <p className="lead-p">
              Clear answers regarding entrance examination formats, boarding facilities, and admission timelines.
            </p>
          </div>

          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <FaqAccordion faqs={homeFaqs} />
          </div>
        </div>
      </section>

      {/* Download Prospectus Modal */}
      <DownloadProspectusModal
        isOpen={isProspectusOpen}
        onClose={() => setIsProspectusOpen(false)}
        phone={phone}
      />
    </div>
  );
}

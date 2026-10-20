'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Award,
  BookOpen,
  Activity,
  Layers,
  Clock,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface VideoChapter {
  id: string;
  timeLabel: string;
  title: string;
  desc: string;
  duration: string;
  poster: string;
  academicObjective: string;
  keyTakeaways: string[];
}

const chapters: VideoChapter[] = [
  {
    id: 'pt-drill',
    timeLabel: '05:30 AM',
    title: 'Reveille, Physical Conditioning & Morning Parade Drill',
    desc: 'Cadets assemble at dawn on our outdoor grounds for running endurance, squad drill posture, and yoga under ex-servicemen instructors.',
    duration: '02:40',
    poster: '/images/physical_training_ground.jpg',
    academicObjective: 'Physical stamina and mental alertness for long examination sessions.',
    keyTakeaways: [
      '1.6 km timed endurance conditioning',
      'SSB obstacle agility and beam balancing',
      'Posture, respiratory control, and morning focus',
    ],
  },
  {
    id: 'math-proofs',
    timeLabel: '09:00 AM',
    title: 'Classroom Lecture Hall: Mathematics & Step-by-Step Proofs',
    desc: 'Senior subject masters conduct deep conceptual derivations on the chalkboard. Cadets understand theorem foundations before applying speed techniques.',
    duration: '03:15',
    poster: '/images/faculty_seminar_class.jpg',
    academicObjective: '50% weightage in Sainik School & RIMC entrance examinations.',
    keyTakeaways: [
      'First-principles derivations before shortcuts',
      'Individual table doubt resolution (15:1 ratio)',
      'Algebraic equation formulation & geometry theorems',
    ],
  },
  {
    id: 'omr-speed',
    timeLabel: '02:00 PM',
    title: 'Intelligence Logic & Timed NTA OMR Speed Drills',
    desc: 'Rigorous daily practice in spatial reasoning, number pattern matrices, and timed bubbling drills to eliminate negative marking errors.',
    duration: '02:50',
    poster: '/images/classroom_study_group.jpg',
    academicObjective: 'Cognitive acuity and test hall invigilation discipline.',
    keyTakeaways: [
      'Non-verbal pattern matrices & series decoding',
      'Exact 150-minute NTA exam hall simulation',
      'Error log analysis and question skipping strategy',
    ],
  },
  {
    id: 'obstacle-course',
    timeLabel: '05:00 PM',
    title: 'SSB Standard Obstacle Training & Outdoor Sports',
    desc: 'Cadets navigate high walls, rope climbs, and horizontal beams to build the physical courage and poise required for military interviews.',
    duration: '03:30',
    poster: '/images/physical_training_ground.jpg',
    academicObjective: 'Military bearing, agility, and team camaraderie.',
    keyTakeaways: [
      'Standard military school obstacle familiarity',
      'Teamwork and group obstacle task coordination',
      'Injury prevention under ex-defence coaches',
    ],
  },
  {
    id: 'evening-study',
    timeLabel: '07:30 PM',
    title: 'Supervised Evening Study Hall & Personal Mentorship',
    desc: 'Dedicated quiet study hall where faculty provide one-on-one doubt clearing, review test notebooks, and ensure complete syllabus comprehension.',
    duration: '03:00',
    poster: '/images/library_study_hall.jpg',
    academicObjective: 'Daily consolidation and mastery without unaddressed doubts.',
    keyTakeaways: [
      'Compulsory faculty presence during self-study',
      'Daily formula revision and vocabulary journals',
      'Wholesome dining and disciplined 10:00 PM lights-out',
    ],
  },
];

export default function AcademyVideoShowcase() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(160); // default 2m40s
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeChapter = chapters[activeChapterIndex];

  // Handle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser restricts autoplay with audio, fallback muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true));
          }
        });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  return (
    <section
      id="academy-videos"
      className="section"
      style={{
        backgroundColor: '#091c30',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(197, 155, 39, 0.25)',
        borderBottom: '1px solid rgba(197, 155, 39, 0.25)',
      }}
    >
      {/* Background Scholarly Accent Gradients */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 30, 34, 0.22) 0%, rgba(9, 28, 48, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 155, 39, 0.15) 0%, rgba(9, 28, 48, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }} className="scroll-fade-up">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(197, 155, 39, 0.15)',
              border: '1px solid rgba(197, 155, 39, 0.35)',
              color: 'var(--gold-light)',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={14} />
            <span>Academic Life in Motion • Video Showcase</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.22,
              marginBottom: '16px',
            }}
          >
            Experience Daily Cadet Training & Classroom Rigor
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
              color: '#cbd5e1',
              lineHeight: 1.7,
            }}
          >
            Step inside our Amaravathinagar campus. Watch how our cadets balance physical endurance, chalkboard mathematical proofs, and supervised evening study.
          </p>
        </div>

        {/* Chapter Selection Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
          className="scroll-fade-up stagger-1"
        >
          {chapters.map((ch, idx) => {
            const isSelected = idx === activeChapterIndex;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #c59b27' : '1px solid rgba(255, 255, 255, 0.14)',
                  backgroundColor: isSelected ? 'rgba(197, 155, 39, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span style={{ color: isSelected ? '#d8af3c' : '#64748b', fontWeight: 800 }}>{ch.timeLabel}</span>
                <span>{ch.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Cinematic Master Video Player Container */}
        <div
          style={{
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#061320',
            border: '1px solid rgba(197, 155, 39, 0.3)',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.7)',
            position: 'relative',
            marginBottom: '40px',
          }}
          className="scroll-fade-up stagger-2"
        >
          {/* Top Video Header Bar */}
          <div
            style={{
              padding: '14px 24px',
              backgroundColor: 'rgba(9, 28, 48, 0.92)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  backgroundColor: 'var(--academic-crimson)',
                  color: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                LIVE REEL • {activeChapter.timeLabel}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {activeChapter.title}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} style={{ color: 'var(--gold-light)' }} />
                <span>{activeChapter.duration}</span>
              </span>
              <span>•</span>
              <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>1080p Ultra HD</span>
            </div>
          </div>

          {/* Video Screen Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              maxHeight: '620px',
              backgroundColor: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src="/videos/cadet_training_sample.mp4"
              poster={activeChapter.poster}
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Poster Overlay Gradient for readability */}
            {!isPlaying && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(9, 28, 48, 0.6) 100%)',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Big Center Play Button when paused */}
            {!isPlaying && (
              <button
                aria-label="Play Video"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                style={{
                  position: 'absolute',
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(139, 30, 34, 0.92)',
                  color: '#ffffff',
                  border: '3px solid rgba(216, 175, 60, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 36px rgba(139, 30, 34, 0.6), 0 8px 24px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.12)';
                  e.currentTarget.style.backgroundColor = '#8b1e22';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(139, 30, 34, 0.92)';
                }}
              >
                <Play size={36} fill="#ffffff" style={{ marginLeft: '4px' }} />
              </button>
            )}

            {/* Subtitles / Academic Commentary Overlay */}
            {captionsEnabled && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '76px',
                  left: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(9, 28, 48, 0.88)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(197, 155, 39, 0.35)',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  zIndex: 8,
                  pointerEvents: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Award size={18} style={{ color: 'var(--gold-light)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: '#ffffff', lineHeight: 1.5 }}>
                    <strong>Cadet Focus:</strong> {activeChapter.academicObjective}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  Amaravathinagar Campus Reel
                </span>
              </div>
            )}
          </div>

          {/* Custom Video Controls Bar */}
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: 'rgba(9, 28, 48, 0.96)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Interactive Seek Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: '40px' }}>
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 160}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  flex: 1,
                  height: '5px',
                  borderRadius: '3px',
                  accentColor: 'var(--academic-gold)',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: '40px', textAlign: 'right' }}>
                {activeChapter.duration}
              </span>
            </div>

            {/* Button Actions Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={togglePlay}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: isPlaying ? 'rgba(255,255,255,0.1)' : 'var(--academic-crimson)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={16} /> <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="#ffffff" /> <span>Play Video</span>
                    </>
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '6px',
                    color: isMuted ? '#94a3b8' : 'var(--gold-light)',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                  }}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>

                <button
                  onClick={() => setCaptionsEnabled(!captionsEnabled)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '6px',
                    color: captionsEnabled ? 'var(--gold-light)' : '#94a3b8',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  CC {captionsEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setShowTheatreModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(197, 155, 39, 0.4)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Maximize size={15} style={{ color: 'var(--gold-light)' }} />
                  <span>Theatre Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Interactive Companion Video Reels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
          className="grid-3 scroll-fade-up stagger-3"
        >
          {chapters.slice(0, 3).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleSelectChapter(idx)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: idx === activeChapterIndex ? '1px solid #c59b27' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: idx === activeChapterIndex ? '0 10px 24px rgba(197, 155, 39, 0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(197, 155, 39, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = idx === activeChapterIndex ? '#c59b27' : 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                <img
                  src={item.poster}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(9, 28, 48, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(139, 30, 34, 0.85)',
                      border: '2px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <Play size={18} fill="#ffffff" style={{ marginLeft: '2px' }} />
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {item.duration}
                </div>
              </div>

              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {item.timeLabel}
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#ffffff', marginBottom: '6px', lineHeight: 1.3 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Theatre Modal */}
      {showTheatreModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(16px)',
          }}
          onClick={() => setShowTheatreModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1080px',
              backgroundColor: '#091c30',
              borderRadius: '16px',
              border: '1px solid rgba(197, 155, 39, 0.4)',
              overflow: 'hidden',
              boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={18} style={{ color: 'var(--gold-light)' }} />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  Academy Theatre • {activeChapter.title}
                </span>
              </div>
              <button
                onClick={() => setShowTheatreModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000000' }}>
              <video
                src="/videos/cadet_training_sample.mp4"
                poster={activeChapter.poster}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '20px 24px', backgroundColor: '#061320' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h4 style={{ color: 'var(--gold-light)', fontSize: '1.15rem', marginBottom: '6px' }}>
                    {activeChapter.title}
                  </h4>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '700px', margin: 0 }}>
                    {activeChapter.desc}
                  </p>
                </div>
                <button
                  onClick={() => setShowTheatreModal(false)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 20px' }}
                >
                  Close Theatre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

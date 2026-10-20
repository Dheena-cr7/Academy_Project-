'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      if (window.scrollY > 280) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circle calculations for progress ring
  const circleRadius = 22;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Top Academic Reading Progress Bar with Glowing Tip */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${scrollProgress}%`,
          height: '3.5px',
          background: 'linear-gradient(90deg, #f7e096 0%, #d4af37 40%, #9e1c24 75%, #091c33 100%)',
          zIndex: 99999,
          transition: 'width 0.1s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 0 12px rgba(212, 175, 55, 0.7), 0 0 4px rgba(247, 224, 150, 0.9)',
        }}
        aria-hidden="true"
      />

      {/* Floating Interactive Circular Scroll Depth & Back-To-Top Widget */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 990,
          opacity: showBackToTop ? 1 : 0,
          transform: showBackToTop ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.85)',
          pointerEvents: showBackToTop ? 'auto' : 'none',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={scrollToTop}
          aria-label={`Scroll to top. Currently at ${Math.round(scrollProgress)} percent`}
          style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: isHovered ? '#091c33' : '#0c2442',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isHovered
              ? '0 12px 28px rgba(9, 28, 51, 0.4), 0 0 18px rgba(212, 175, 55, 0.45)'
              : '0 6px 20px rgba(9, 28, 51, 0.25)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: 0,
          }}
        >
          {/* Circular SVG Progress Ring */}
          <svg
            width="56"
            height="56"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(-90deg)',
              pointerEvents: 'none',
            }}
          >
            {/* Background Track */}
            <circle
              cx="28"
              cy="28"
              r={circleRadius}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="3"
              fill="transparent"
            />
            {/* Animated Progress Arc */}
            <circle
              cx="28"
              cy="28"
              r={circleRadius}
              stroke="url(#progressGradient)"
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.15s ease' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f7e096" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#9e1c24" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content: Arrow icon & percentage */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              zIndex: 2,
            }}
          >
            <ArrowUp
              size={18}
              style={{
                color: isHovered ? '#f7e096' : '#ffffff',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 0.2s ease, color 0.2s ease',
              }}
            />
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                color: isHovered ? '#f7e096' : 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1,
                marginTop: '1px',
              }}
            >
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </button>
      </div>
    </>
  );
}

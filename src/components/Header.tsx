'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Shield, ChevronDown, FileText, BookOpen, Users, Building, Award, ArrowRight } from 'lucide-react';
import DownloadProspectusModal from './DownloadProspectusModal';

interface HeaderProps {
  phone?: string;
}

export default function Header({ phone = '+91 94437 18847' }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const [isProspectusOpen, setIsProspectusOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      const sections = ['academic-framework', 'programmes', 'academy-videos', 'cadet-schedule', 'admissions-contact'];
      const scrollPos = window.scrollY + 140;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  return (
    <>
      {/* Skip to Content for WCAG Accessibility */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Skip to main content
      </a>

      <header
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.97)' : '#ffffff',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(7, 19, 37, 0.12)' : '1px solid rgba(7, 19, 37, 0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          boxShadow: scrolled ? '0 10px 30px -6px rgba(7, 19, 37, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '28px',
            paddingRight: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: scrolled ? '11px' : '15px',
            paddingBottom: scrolled ? '11px' : '15px',
            transition: 'padding 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Institution Crest Branding */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #071325 0%, #8b1e22 100%)',
                border: '2px solid #d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f7e2a4',
                boxShadow: '0 4px 14px rgba(7, 19, 37, 0.25)',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <Shield size={23} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--academic-navy)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap',
                }}
              >
                Kalaivani Sainik Academy
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--academic-gold-dark)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  marginTop: '1px',
                }}
              >
                Amaravathinagar • Est. 2004
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{ display: 'none' }}
            className="desktop-nav"
            aria-label="Primary Navigation"
          >
            <ul
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {/* Home */}
              <li>
                <Link
                  href="/"
                  className={`header-nav-link ${activeSection === 'home' ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>

              {/* Academics */}
              <li>
                <a
                  href="/#academic-framework"
                  className={`header-nav-link ${activeSection === 'academic-framework' ? 'active' : ''}`}
                >
                  Academics
                </a>
              </li>

              {/* Programmes with Luxury Dropdown */}
              <li
                style={{ position: 'relative' }}
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                onMouseLeave={() => setCoursesDropdownOpen(false)}
              >
                <Link
                  href="/courses"
                  className={`header-nav-link ${activeSection === 'programmes' || coursesDropdownOpen ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Programmes</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: coursesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </Link>

                {coursesDropdownOpen && (
                  <div className="header-dropdown-menu" style={{ width: '320px' }}>
                    <Link href="/courses/sainik-school" className="dropdown-item-link">
                      <div style={{ color: 'var(--academic-crimson)', marginTop: '2px' }}>
                        <Shield size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--academic-navy)' }}>
                          AISSEE Sainik School
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
                          Class VI & IX Residential Preparation
                        </div>
                      </div>
                    </Link>

                    <Link href="/courses/rimc" className="dropdown-item-link">
                      <div style={{ color: 'var(--academic-gold-dark)', marginTop: '2px' }}>
                        <Award size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--academic-navy)' }}>
                          RIMC Dehradun
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
                          Subjective Math & English Essay
                        </div>
                      </div>
                    </Link>

                    <Link href="/courses/rms" className="dropdown-item-link">
                      <div style={{ color: 'var(--academic-navy)', marginTop: '2px' }}>
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--academic-navy)' }}>
                          Rashtriya Military Schools (RMS)
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>
                          CET OMR Drills & Interview Panel
                        </div>
                      </div>
                    </Link>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '6px', paddingTop: '6px' }}>
                      <Link
                        href="/courses"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--academic-gold-dark)',
                        }}
                      >
                        <span>View All Programmes Overview</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {/* Cadet Life & Video */}
              <li>
                <a
                  href="/#academy-videos"
                  className={`header-nav-link ${activeSection === 'academy-videos' ? 'active' : ''}`}
                >
                  Cadet Life
                </a>
              </li>

              {/* Timetable */}
              <li>
                <a
                  href="/#cadet-schedule"
                  className={`header-nav-link ${activeSection === 'cadet-schedule' ? 'active' : ''}`}
                >
                  Timetable
                </a>
              </li>

              {/* Campus & Faculty Dropdown */}
              <li
                style={{ position: 'relative' }}
                onMouseEnter={() => setCampusDropdownOpen(true)}
                onMouseLeave={() => setCampusDropdownOpen(false)}
              >
                <Link
                  href="/faculty"
                  className={`header-nav-link ${activeSection === 'faculty' || campusDropdownOpen ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Campus & Faculty</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: campusDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </Link>

                {campusDropdownOpen && (
                  <div className="header-dropdown-menu" style={{ width: '280px' }}>
                    <Link href="/faculty" className="dropdown-item-link">
                      <Users size={16} style={{ color: 'var(--academic-crimson)' }} />
                      <span style={{ fontWeight: 600 }}>Senior Faculty Mentors</span>
                    </Link>

                    <Link href="/facilities" className="dropdown-item-link">
                      <Building size={16} style={{ color: 'var(--academic-gold-dark)' }} />
                      <span style={{ fontWeight: 600 }}>Campus & Boarding</span>
                    </Link>

                    <Link href="/results" className="dropdown-item-link">
                      <Award size={16} style={{ color: 'var(--academic-navy)' }} />
                      <span style={{ fontWeight: 600 }}>Verified Selection Record</span>
                    </Link>
                  </div>
                )}
              </li>

              {/* Admissions */}
              <li>
                <a
                  href="/#admissions-contact"
                  className={`header-nav-link ${activeSection === 'admissions-contact' ? 'active' : ''}`}
                >
                  Admissions
                </a>
              </li>
            </ul>
          </nav>

          {/* Desktop Right Actions */}
          <div
            style={{ display: 'none', alignItems: 'center', gap: '12px' }}
            className="desktop-actions"
          >
            {/* Call Admissions Desk with Live Beacon */}
            <a
              href={`tel:${cleanPhone}`}
              className="header-phone-btn"
              title="Call Academic Admissions Desk"
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                  display: 'inline-block',
                }}
              />
              <Phone size={14} style={{ color: 'var(--academic-crimson)' }} />
              <span>{phone}</span>
            </a>

            {/* Prospectus Button */}
            <button
              onClick={() => setIsProspectusOpen(true)}
              className="header-prospectus-btn"
            >
              <FileText size={15} />
              <span>Prospectus PDF</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="mobile-toggle">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                border: '1px solid rgba(7, 19, 37, 0.12)',
                backgroundColor: 'rgba(7, 19, 37, 0.04)',
                color: 'var(--academic-navy)',
                cursor: 'pointer',
              }}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid rgba(7, 19, 37, 0.1)',
              padding: '20px 24px 32px',
              boxShadow: '0 16px 36px rgba(0,0,0,0.1)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--academic-navy)',
                  backgroundColor: 'var(--ivory-light)',
                }}
              >
                Home
              </Link>

              <a
                href="/#academic-framework"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--academic-navy)',
                }}
              >
                Academics & Philosophy
              </a>

              <Link
                href="/courses"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--academic-navy)',
                }}
              >
                Programmes (Sainik, RIMC, RMS)
              </Link>

              <a
                href="/#academy-videos"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--academic-navy)',
                }}
              >
                Cadet Life Reel
              </a>

              <a
                href="/#cadet-schedule"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--academic-navy)',
                }}
              >
                Cadet Timetable
              </a>

              <Link
                href="/faculty"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--academic-navy)',
                }}
              >
                Faculty & Mentors
              </Link>

              <Link
                href="/results"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--academic-navy)',
                }}
              >
                Verified Results
              </Link>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`tel:${cleanPhone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--academic-navy)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <Phone size={16} />
                  <span>Call {phone}</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsProspectusOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--gold-gradient)',
                    color: '#071325',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FileText size={16} />
                  <span>Download Prospectus</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <DownloadProspectusModal
        isOpen={isProspectusOpen}
        onClose={() => setIsProspectusOpen(false)}
      />
    </>
  );
}

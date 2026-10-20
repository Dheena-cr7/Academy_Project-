'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, Clock, Lock, ExternalLink, Award } from 'lucide-react';

interface FooterProps {
  phone?: string;
  address?: string;
  email?: string;
  officeHours?: string;
  directionsUrl?: string;
}

export default function Footer({
  phone = '+91 94437 18847',
  address = 'Near State Bank of India, Amaravathinagar, Udumalpet–Munnar Road, Amaravathi, Tamil Nadu 642102, India',
  email = 'admissions@kalaivanisainikcoachingcentre.org.in',
  officeHours = 'Monday – Saturday: 08:30 AM to 06:30 PM IST | Sunday: By prior appointment',
  directionsUrl = 'https://www.google.com/maps/place/Kalaivani+Sainik+RIMC+Coaching+Centre/@10.4389671,77.25874,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9d46d0ff1cfc9:0xe56e603aa6762c8a!8m2!3d10.4389671!4d77.2613149!16s%2Fg%2F11c7t40964?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D',
}: FooterProps) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  return (
    <footer
      style={{
        backgroundColor: '#040d1a',
        color: '#ffffff',
        paddingTop: '80px',
        borderTop: '2px solid rgba(212, 175, 55, 0.4)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        {/* Main 4-Column Layout */}
        <div
          className="grid-4"
          style={{
            gap: '44px',
            paddingBottom: '56px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Col 1: Institution Emblem & Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #071325 0%, #8b1e22 100%)',
                  border: '1.5px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f7e2a4',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                }}
              >
                <Shield size={22} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    lineHeight: '1.15',
                    fontWeight: 700,
                  }}
                >
                  Kalaivani Sainik Academy
                </h3>
                <span
                  style={{
                    fontSize: '0.725rem',
                    color: 'var(--academic-gold-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}
                >
                  Amaravathinagar • Est. 2004
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.65' }}>
              Premier residential preparatory tutorial academy delivering specialized foundational coaching for All India Sainik Schools (AISSEE Class VI & IX), RIMC Dehradun, and Rashtriya Military Schools entrance examinations.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: 'var(--academic-gold-light)',
                  padding: '3px 9px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                22+ Years Legacy
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  padding: '3px 9px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                Co-Ed Boarding
              </span>
            </div>
          </div>

          {/* Col 2: Academic Programmes */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Academic Programmes
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '0.875rem',
                color: '#94a3b8',
                padding: 0,
              }}
            >
              <li>
                <Link href="/courses/sainik-school" className="footer-nav-link">
                  Sainik School (AISSEE Class VI & IX)
                </Link>
              </li>
              <li>
                <Link href="/courses/rimc" className="footer-nav-link">
                  RIMC Dehradun Class VIII Entrance
                </Link>
              </li>
              <li>
                <Link href="/courses/rms" className="footer-nav-link">
                  Rashtriya Military Schools (RMS CET)
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="footer-nav-link">
                  Admissions & Eligibility Criteria
                </Link>
              </li>
              <li>
                <Link href="/results" className="footer-nav-link">
                  Verified Cadets Selection Record
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus & Life */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Institution & Campus
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '0.875rem',
                color: '#94a3b8',
                padding: 0,
              }}
            >
              <li>
                <Link href="/about" className="footer-nav-link">
                  Academy Heritage & Philosophy
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="footer-nav-link">
                  Master Mentors & Subject Faculty
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="footer-nav-link">
                  Residential Boarding & Physical Grounds
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="footer-nav-link">
                  Campus Life Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="footer-nav-link">
                  Parent Testimonials & Letters
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-nav-link">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Admissions Desk */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Admissions Desk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--academic-gold)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ lineHeight: '1.5', display: 'block' }}>{address}</span>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--academic-gold)',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                    }}
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--academic-gold)', flexShrink: 0 }} />
                <a
                  href={`tel:${cleanPhone}`}
                  style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}
                >
                  {phone}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--academic-gold)', flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>{email}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Clock size={16} style={{ color: 'var(--academic-gold)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Statutory Disclaimer */}
        <div
          style={{
            padding: '24px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.785rem',
            color: '#94a3b8',
            lineHeight: '1.65',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <strong style={{ color: 'var(--academic-gold-light)', display: 'block', marginBottom: '4px' }}>
              Statutory Transparency & Ethical Notice:
            </strong>
            Kalaivani Sainik RIMC Coaching Centre is an independent private coaching tutorial institution providing academic and physical mentoring for competitive defence school entrance examinations. The academy is <strong>NOT</strong> affiliated with, operated by, endorsed by, or connected to the Ministry of Defence, Government of India, the Sainik Schools Society, RIMC Dehradun, or Rashtriya Military Schools. Examination dates, official prospectuses, and seat allocations are administered exclusively by respective competent government bodies (National Testing Agency / DGMT / Sainik Schools Society).
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            padding: '22px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} Kalaivani Sainik RIMC Coaching Centre. All rights reserved. Amaravathinagar, Udumalpet, Tamil Nadu.
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/privacy" className="footer-nav-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="footer-nav-link">
              Terms of Service
            </Link>
            <Link
              href="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--academic-gold-light)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Lock size={12} /> Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

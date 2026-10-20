'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  defaultOpenIndex?: number;
}

export default function FaqAccordion({ faqs, defaultOpenIndex = 0 }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              borderColor: isOpen ? 'var(--academic-gold)' : '#e2e8f0',
              boxShadow: isOpen ? '0 8px 24px -4px rgba(7, 19, 37, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
              borderLeft: isOpen ? '4px solid var(--academic-gold)' : '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => toggle(index)}
              style={{
                width: '100%',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'rgba(7, 19, 37, 0.02)' : '#ffffff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                gap: '16px',
                transition: 'background 0.2s ease',
              }}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq.id}`}
              id={`faq-btn-${faq.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isOpen ? 'var(--academic-gold-dark)' : 'var(--text-dark-muted)',
                    backgroundColor: isOpen ? 'rgba(212, 175, 55, 0.12)' : 'var(--ivory-light)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {faq.category}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: isOpen ? 'var(--academic-navy)' : 'var(--text-dark)',
                    lineHeight: '1.4',
                  }}
                >
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                size={20}
                style={{
                  color: isOpen ? 'var(--academic-gold-dark)' : 'var(--text-dark-muted)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0,
                }}
              />
            </button>

            {isOpen && (
              <div
                id={`faq-answer-${faq.id}`}
                role="region"
                aria-labelledby={`faq-btn-${faq.id}`}
                style={{
                  padding: '16px 24px 24px 24px',
                  fontSize: '0.95rem',
                  color: 'var(--text-dark-muted)',
                  lineHeight: '1.75',
                  borderTop: '1px solid rgba(7, 19, 37, 0.06)',
                  backgroundColor: '#ffffff',
                  animation: 'tabFadeIn 0.25s ease forwards',
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

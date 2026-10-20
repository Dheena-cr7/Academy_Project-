'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import ContactCTAButtons from '@/components/ContactCTAButtons';
import FaqAccordion from '@/components/FaqAccordion';
import { Search } from 'lucide-react';

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allFaqs = [
    {
      id: 'faq-1',
      category: 'Age & Eligibility',
      question: 'What is the exact age criteria for Sainik School (AISSEE) Class VI admission?',
      answer:
        'A candidate should be between 10 and 12 years of age as on 31st March of the year in which admission is sought. For instance, for admission to the 2027–2028 academic session, the child must have been born between 1st April 2015 and 31st March 2017 (both dates inclusive). Girls and boys are equally eligible.',
    },
    {
      id: 'faq-2',
      category: 'Age & Eligibility',
      question: 'What is the age criteria for Sainik School Class IX admission?',
      answer:
        'For admission to Class IX, the candidate should be between 13 and 15 years of age as on 31st March of the year in which admission is sought, and must have passed Class VIII from a recognized school. Girls are also eligible for Class IX admission in designated Sainik Schools subject to annual vacancies.',
    },
    {
      id: 'faq-3',
      category: 'Age & Eligibility',
      question: 'What are the eligibility conditions for RIMC Dehradun Class VIII entry?',
      answer:
        'For RIMC Dehradun, the candidate must be between 11½ and 13 years of age as on 1st January (for the July term) or 1st July (for the January term). The student should either be studying in Class VII or have passed Class VII from a recognized educational institution. Both boys and girls can apply.',
    },
    {
      id: 'faq-4',
      category: 'Institution & Affiliation',
      question: 'Is Kalaivani Sainik Coaching Centre affiliated with the Ministry of Defence?',
      answer:
        'No. Kalaivani Sainik RIMC Coaching Centre is an independent, private preparatory coaching academy. We are not run by, affiliated with, or recognized by the Ministry of Defence, the Sainik Schools Society, RIMC Dehradun, or Rashtriya Military Schools. We prepare students academically and physically for the entrance examinations conducted by these organizations.',
    },
    {
      id: 'faq-5',
      category: 'Institution & Affiliation',
      question: 'Can any coaching centre guarantee selection in Sainik Schools or RIMC?',
      answer:
        'Absolutely not. Any claim of "guaranteed selection" or "reserved management quota" is false and deceptive. All admissions to Sainik Schools (via NTA AISSEE), RIMC, and RMS are based strictly on national competitive merit, e-counselling choices, and medical board clearance.',
    },
    {
      id: 'faq-6',
      category: 'Coaching & Curriculum',
      question: 'What is the medium of instruction at Kalaivani Coaching Centre?',
      answer:
        'Classroom lectures and study materials are predominantly in English to align with competitive defense exam standards, with bilingual Tamil explanation provided whenever necessary to help rural students grasp complex mathematical and scientific concepts.',
    },
    {
      id: 'faq-7',
      category: 'Coaching & Curriculum',
      question: 'How are mock tests conducted?',
      answer:
        'We conduct weekly Sunday mock examinations using standard optical mark recognition (OMR) response sheets identical to the real NTA AISSEE test. Scores, time analysis, and question-by-question diagnostic reports are provided to students and sent to parents.',
    },
    {
      id: 'faq-8',
      category: 'Boarding & Facilities',
      question: 'Do you provide residential boarding for outstation students?',
      answer:
        'Yes. We offer fully supervised residential boarding facilities with separate hostel wings for boys and girls, nutritious vegetarian and non-vegetarian dining, daily morning physical fitness training, and supervised evening library study hours.',
    },
    {
      id: 'faq-9',
      category: 'Boarding & Facilities',
      question: 'Can parents meet or speak with their children during boarding?',
      answer:
        'Yes. Parents can call during designated weekend telephone windows (Saturdays and Sundays). Visiting hours are permitted on the second and fourth Sundays of each month by prior appointment with the hostel warden.',
    },
    {
      id: 'faq-10',
      category: 'Medical & Physical',
      question: 'Do you provide guidance for the military school medical fitness test?',
      answer:
        'Yes. Our curriculum includes regular height, weight, BMI, and vision trajectory monitoring. Retired armed forces mentors guide parents on common temporary medical disqualifications (such as knock-knees, flat feet, ear wax, and dental hygiene) so they can be addressed well before the official medical board examination.',
    },
  ];

  const categories = ['All', 'Age & Eligibility', 'Institution & Affiliation', 'Coaching & Curriculum', 'Boarding & Facilities', 'Medical & Physical'];

  const filteredFaqs = allFaqs.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: allFaqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

      <section className="section-tight" style={{ backgroundColor: 'var(--navy-primary)', color: 'var(--ivory-white)' }}>
        <div className="container">
          <span className="section-eyebrow-light">Knowledge Base</span>
          <h1 className="h1-hero-light" style={{ marginBottom: '16px' }}>
            Frequently Asked Questions
          </h1>
          <p className="lead-p-light" style={{ maxWidth: '820px' }}>
            Get clear, authentic answers to common parental questions regarding age cut-offs, entrance syllabi, boarding facilities, and coaching schedules.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '920px' }}>
          {/* Search & Filter Bar */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search questions (e.g. age limit, class 6, boarding, medical)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '44px', fontSize: '1rem', height: '52px' }}
              />
              <Search
                size={20}
                style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dark-muted)' }}
              />
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    backgroundColor: selectedCategory === cat ? 'var(--navy-primary)' : '#ffffff',
                    color: selectedCategory === cat ? '#ffffff' : 'var(--text-dark)',
                    border: '1px solid var(--ivory-muted)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered FAQs */}
          {filteredFaqs.length > 0 ? (
            <FaqAccordion faqs={filteredFaqs} defaultOpenIndex={0} />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-primary)', marginBottom: '8px' }}>
                No matching questions found
              </h3>
              <p style={{ color: 'var(--text-dark-muted)', marginBottom: '20px' }}>
                Can’t find what you are looking for? Call our admission team directly at +91 94437 18847.
              </p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="btn btn-primary">
                Reset Search Filters
              </button>
            </div>
          )}

          <div className="disclaimer-banner" style={{ marginTop: '48px' }}>
            <strong>Official Guidelines: </strong>
            Admission criteria, seat reservation formulas, and examination dates are subject to change by NTA and the Sainik Schools Society. Kalaivani Coaching Centre advises parents to check official government notifications published in the National Employment News.
          </div>
        </div>
      </section>

      <section className="section section-ivory" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="h2-title" style={{ marginBottom: '16px' }}>
            Still Have Questions?
          </h2>
          <p className="lead-p" style={{ marginBottom: '28px' }}>
            Speak directly with our senior admission counsellor for immediate clarity on your child’s eligibility.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactCTAButtons
              phone="+91 94437 18847"
              whatsappNumber="919443718847"
              sourceContext="FAQ Page Bottom"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

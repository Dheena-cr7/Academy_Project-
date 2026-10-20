'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Shield,
  ArrowRight,
  Phone,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { trackCallIntent } from '@/lib/utils';

export default function CadetEligibilityCalculator() {
  const [targetExam, setTargetExam] = useState<'sainik_6' | 'sainik_9' | 'rimc' | 'rms_6' | 'rms_9'>('sainik_6');
  const [dobYear, setDobYear] = useState<number>(2016);
  const [dobMonth, setDobMonth] = useState<number>(5); // 0-indexed: 5 = June
  const [dobDay, setDobDay] = useState<number>(15);
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [result, setResult] = useState<any>(null);

  const cutoffDate = new Date(2027, 2, 31); // 31 March 2027

  const calculateEligibility = (e: React.FormEvent) => {
    e.preventDefault();

    const birthDate = new Date(dobYear, dobMonth, dobDay);
    
    let years = cutoffDate.getFullYear() - birthDate.getFullYear();
    let months = cutoffDate.getMonth() - birthDate.getMonth();
    let days = cutoffDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(cutoffDate.getFullYear(), cutoffDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const ageDecimal = years + months / 12 + days / 365.25;

    let isEligible = false;
    let reason = '';
    let recommendation = '';
    let badgeText = '';

    if (targetExam === 'sainik_6' || targetExam === 'rms_6') {
      const examName = targetExam === 'sainik_6' ? 'AISSEE Sainik School Class VI' : 'RMS CET Class VI';
      if (ageDecimal >= 10.0 && ageDecimal <= 12.0) {
        isEligible = true;
        badgeText = `Eligible for ${examName}`;
        reason = `Candidate will be exactly ${years} years, ${months} months, and ${days} days old on 31 March 2027 (Official NTA criteria: 10 to 12 years).`;
        recommendation = 'Recommended: 1-Year Residential Foundation & Intensive OMR Batch. Batch enrolment is currently active for 2026–2027.';
      } else if (ageDecimal < 10.0) {
        isEligible = false;
        badgeText = 'Under-Age for 2027 (Eligible for Future Batch)';
        reason = `Candidate will be ${years} years and ${months} months old on 31 March 2027 (Minimum age required is 10 years).`;
        recommendation = `Candidate will become eligible for the ${2027 + Math.ceil(10 - ageDecimal)} AISSEE Entrance. Join our Early Foundation Pre-Cadet weekend course.`;
      } else {
        isEligible = false;
        badgeText = 'Age Limit Exceeded for Class VI';
        reason = `Candidate will be ${years} years and ${months} months old on 31 March 2027 (Maximum permitted age is 12 years).`;
        recommendation = 'Candidate can prepare for AISSEE Class IX entrance examination (Age criteria: 13 to 15 years).';
      }
    } else if (targetExam === 'sainik_9' || targetExam === 'rms_9') {
      const examName = targetExam === 'sainik_9' ? 'AISSEE Sainik School Class IX' : 'RMS CET Class IX';
      if (ageDecimal >= 13.0 && ageDecimal <= 15.0) {
        isEligible = true;
        badgeText = `Eligible for ${examName}`;
        reason = `Candidate will be exactly ${years} years, ${months} months, and ${days} days old on 31 March 2027 (Official NTA criteria: 13 to 15 years).`;
        recommendation = 'Recommended: Intensive Class IX Mathematics, Science, English & Intelligence Batch with weekly OMR testing.';
      } else if (ageDecimal < 13.0) {
        isEligible = false;
        badgeText = 'Under-Age for Class IX';
        reason = `Candidate will be ${years} years and ${months} months old (Minimum age required for Class IX is 13 years).`;
        recommendation = 'If student is currently in Class 5 or 6, verify eligibility for Class VI entrance instead.';
      } else {
        isEligible = false;
        badgeText = 'Age Limit Exceeded for Class IX';
        reason = `Candidate will be ${years} years old on cut-off date (Maximum permitted age is 15 years).`;
        recommendation = 'Candidate may prepare for NDA (National Defence Academy) entrance foundation after Class 10/11.';
      }
    } else if (targetExam === 'rimc') {
      if (ageDecimal >= 11.5 && ageDecimal <= 13.0) {
        isEligible = true;
        badgeText = 'Eligible for RIMC Dehradun Entrance';
        reason = `Candidate will be ${years} years and ${months} months old on term cut-off (Official RIMC criteria: 11½ to 13 years).`;
        recommendation = 'Recommended: Specialized RIMC Subjective Math & English Essay Writing Batch with Mock Interview Panel.';
      } else if (ageDecimal < 11.5) {
        isEligible = false;
        badgeText = 'Under-Age for RIMC';
        reason = `Candidate will be ${years} years and ${months} months old (Minimum age for RIMC is 11½ years).`;
        recommendation = 'Enrol in foundational language and arithmetic proof building ahead of the next term test.';
      } else {
        isEligible = false;
        badgeText = 'Age Limit Exceeded for RIMC';
        reason = `Candidate will be ${years} years old on cut-off date (Maximum permitted age is 13 years).`;
        recommendation = 'Evaluate AISSEE Class IX entrance examination (up to 15 years).';
      }
    }

    setResult({
      isEligible,
      years,
      months,
      days,
      badgeText,
      reason,
      recommendation,
    });
  };

  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const yearsOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="eligibility-box">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--academic-gold-dark)', marginBottom: '6px' }}>
          <Shield size={18} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Official Statutory Verification Tool
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--academic-navy)', fontWeight: 700 }}>
          Cadet Age & Examination Eligibility Calculator
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>
          Evaluates official National Testing Agency (NTA), RIMC, and DGMT cut-off date criteria for the <strong>2026–2027</strong> academic session (Baseline: 31st March 2027).
        </p>
      </div>

      <form onSubmit={calculateEligibility}>
        {/* Step 1: Select Examination */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">1. Select Target Entrance Examination</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { id: 'sainik_6', label: 'AISSEE Sainik (Class VI)' },
              { id: 'sainik_9', label: 'AISSEE Sainik (Class IX)' },
              { id: 'rimc', label: 'RIMC Dehradun' },
              { id: 'rms_6', label: 'RMS CET (Class VI)' },
              { id: 'rms_9', label: 'RMS CET (Class IX)' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setTargetExam(item.id as any)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: targetExam === item.id ? '2px solid var(--academic-navy)' : '1px solid #cbd5e1',
                  backgroundColor: targetExam === item.id ? 'var(--academic-navy)' : '#ffffff',
                  color: targetExam === item.id ? '#ffffff' : 'var(--text-dark)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Date of Birth Picker */}
        <div style={{ marginBottom: '20px' }}>
          <label className="form-label">2. Student Date of Birth (DD / Month / Year)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <select
                className="form-select"
                value={dobDay}
                onChange={(e) => setDobDay(Number(e.target.value))}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <span className="form-hint">Day</span>
            </div>

            <div>
              <select
                className="form-select"
                value={dobMonth}
                onChange={(e) => setDobMonth(Number(e.target.value))}
              >
                {monthsList.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
              <span className="form-hint">Month</span>
            </div>

            <div>
              <select
                className="form-select"
                value={dobYear}
                onChange={(e) => setDobYear(Number(e.target.value))}
              >
                {yearsOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span className="form-hint">Birth Year</span>
            </div>
          </div>
        </div>

        {/* Step 3: Gender Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label">3. Student Gender</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="radio"
                name="gender"
                checked={gender === 'boy'}
                onChange={() => setGender('boy')}
              />
              <span>Boy Cadet</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="radio"
                name="gender"
                checked={gender === 'girl'}
                onChange={() => setGender('girl')}
              />
              <span>Girl Cadet (AISSEE Class VI & IX eligible)</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="btn btn-gold btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <span>Calculate Statutory Age & Verify Eligibility →</span>
        </button>
      </form>

      {/* Result Display Card */}
      {result && (
        <div
          className={result.isEligible ? 'eligibility-result-success' : 'eligibility-result-warning'}
          style={{ animation: 'tabFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            {result.isEligible ? (
              <CheckCircle size={28} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={28} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
            )}

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: result.isEligible ? '#10b981' : '#f59e0b',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '4px',
                  }}
                >
                  {result.badgeText}
                </span>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-dark-muted)' }}>
                  Age on 31 March 2027: <strong>{result.years} Yrs, {result.months} Mos, {result.days} Days</strong>
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 600, marginBottom: '6px' }}>
                {result.reason}
              </p>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)', marginBottom: '16px' }}>
                {result.recommendation}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`tel:9443718847`}
                  onClick={() => trackCallIntent('eligibility_calculator')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Phone size={14} />
                  <span>Call Admissions Desk (+91 94437 18847)</span>
                </a>

                <a
                  href="#admissions-contact"
                  className="btn btn-secondary btn-sm"
                >
                  <span>Submit Admission Enquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

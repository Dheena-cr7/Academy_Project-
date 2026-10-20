'use client';

import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  Bell,
  BookOpen,
  Award,
  Users,
  HelpCircle,
  Settings,
  Plus,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'announcements' | 'courses' | 'results' | 'faqs'>('settings');
  const [settings, setSettings] = useState<any>({
    institution_name: 'Kalaivani Sainik RIMC Coaching Centre',
    display_phone: '+91 94437 18847',
    international_phone: '+919443718847',
    tel_uri: 'tel:+919443718847',
    whatsapp_number: '919443718847',
    whatsapp_message: 'Hello Kalaivani Sainik RIMC Coaching Centre, I would like to enquire about admission and coaching details for my child.',
    email: 'admissions@kalaivanisainikcoachingcentre.org.in',
    address: 'Near State Bank of India, Amaravathinagar, Udumalpet–Munnar Road, Amaravathi, Tamil Nadu 642102, India',
    office_hours: 'Monday – Saturday: 08:30 AM to 06:30 PM IST | Sunday: By appointment',
    announcement_bar_text: 'Admissions Open for 2026–2027 Entrance Batches (AISSEE Sainik School Class VI & IX, RIMC Dehradun, RMS). Call +91 94437 18847 for counselling.',
    announcement_bar_enabled: 1,
  });

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Central Settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error(err));

    fetch('/api/admin/cms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAnnouncements(data.data.announcements || []);
          setCourses(data.data.courses || []);
          setResults(data.data.results || []);
          setFaqs(data.data.faqs || []);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage('');
    setErrorMessage('');

    if (settings.display_phone !== '+91 94437 18847') {
      if (!confirm(`Warning: You are updating the central official telephone number to "${settings.display_phone}". This will instantly change all Call CTAs across the entire website. Are you sure?`)) {
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setStatusMessage('Central settings updated successfully! Changes are live across all public pages.');
      setTimeout(() => setStatusMessage(''), 3500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Content Management System (CMS)
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Update announcements, course syllabi, verified results, FAQs, and central telephone configurations.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem' }}>
          <Check size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="card" style={{ padding: '10px 14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('settings')}
            className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Settings size={14} /> Contact & Brand Settings
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`btn btn-sm ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Bell size={14} /> Announcements ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={14} /> Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`btn btn-sm ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Award size={14} /> Verified Results ({results.length})
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`btn btn-sm ${activeTab === 'faqs' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <HelpCircle size={14} /> FAQs ({faqs.length})
          </button>
        </div>
      </div>

      {/* 1. Settings Tab: Single Source of Truth Configuration */}
      {activeTab === 'settings' && (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Central Contact Information (Single Source of Truth)
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)' }}>
              Changes made here propagate dynamically to every header, footer, CTA button, dialler link, and schema tag on the site.
            </p>
          </div>

          <form onSubmit={handleSaveSettings}>
            <div className="grid-2" style={{ gap: '20px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="set_inst">Institution Name</label>
                <input
                  id="set_inst"
                  type="text"
                  required
                  value={settings.institution_name || ''}
                  onChange={(e) => setSettings({ ...settings, institution_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set_phone">
                  Official Display Telephone Number <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  id="set_phone"
                  type="text"
                  required
                  value={settings.display_phone || ''}
                  onChange={(e) => setSettings({ ...settings, display_phone: e.target.value })}
                  className="form-input"
                />
                <p className="form-hint">Used for all visible telephone badges and buttons</p>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '20px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="set_wa">WhatsApp Destination Number</label>
                <input
                  id="set_wa"
                  type="text"
                  required
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  className="form-input"
                />
                <p className="form-hint">Format without plus sign, e.g. 919443718847</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set_email">Official Email</label>
                <input
                  id="set_email"
                  type="email"
                  required
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="set_wamsg">Default WhatsApp Enquiry Pre-filled Text</label>
              <textarea
                id="set_wamsg"
                rows={2}
                value={settings.whatsapp_message || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="set_addr">Campus Address</label>
              <textarea
                id="set_addr"
                rows={2}
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="set_directions">Google Maps Directions URL</label>
              <input
                id="set_directions"
                type="url"
                value={settings.directions_url || ''}
                onChange={(e) => setSettings({ ...settings, directions_url: e.target.value })}
                className="form-input"
                placeholder="https://www.google.com/maps/place/..."
              />
              <p className="form-hint">Official Google Maps destination pin link for directions and navigation</p>
            </div>

            <div className="grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="set_hours">Office Hours</label>
                <input
                  id="set_hours"
                  type="text"
                  value={settings.office_hours || ''}
                  onChange={(e) => setSettings({ ...settings, office_hours: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set_ann">Top Announcement Bar Text</label>
                <input
                  id="set_ann"
                  type="text"
                  value={settings.announcement_bar_text || ''}
                  onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-gold btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={18} />
              <span>{saving ? 'Publishing Central Settings...' : 'Save & Publish Changes'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
              Announcements & Notices
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.map((ann) => (
              <div key={ann.id} style={{ padding: '16px', border: '1px solid var(--ivory-muted)', borderRadius: 'var(--radius-sm)', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-gold">{ann.badge || 'Notice'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)' }}>Status: {ann.is_active ? 'Published' : 'Draft'}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>{ann.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Courses Tab */}
      {activeTab === 'courses' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '20px' }}>
            Programmes & Curriculum Modules
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.map((c) => (
              <div key={c.id} style={{ padding: '16px', border: '1px solid var(--ivory-muted)', borderRadius: 'var(--radius-sm)' }}>
                <span className="badge badge-gold" style={{ marginBottom: '6px' }}>{c.badge}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>{c.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', margin: '6px 0' }}>{c.short_description}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                  <strong>Eligibility: </strong>{c.eligibility}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Results Tab */}
      {activeTab === 'results' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '20px' }}>
            Verified Selections
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cadet Name</th>
                  <th>Exam Name</th>
                  <th>Year</th>
                  <th>Allotted School</th>
                  <th>Document Ref</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                    <td>{r.exam_name}</td>
                    <td>{r.year}</td>
                    <td>{r.school_allotted || 'Merit Allotted'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.verified_document_ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '20px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((f) => (
              <div key={f.id} style={{ padding: '16px', border: '1px solid var(--ivory-muted)', borderRadius: 'var(--radius-sm)' }}>
                <span className="badge badge-gold" style={{ marginBottom: '6px' }}>{f.category}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-primary)' }}>{f.question}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Radio,
  ArrowRight,
  TrendingUp,
  Zap,
  PhoneIncoming,
  Calendar,
} from 'lucide-react';
import { formatToKolkata } from '@/lib/utils';
import QuickCallModal from '@/components/admin/QuickCallModal';
import QuickEnquiryModal from '@/components/QuickEnquiryModal';

interface DashboardMetrics {
  newEnquiriesToday: number;
  callAttemptsToday: number;
  connectedCallsToday: number;
  missedCallsToday: number;
  websiteCallIntentsToday: number;
  followUpsDueToday: number;
  overdueFollowUps: number;
  statusCounts: { status: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const fetchDashboardData = () => {
    setLoading(true);
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.metrics);
          setRecentCalls(data.recentCalls || []);
          setRecentEnquiries(data.recentEnquiries || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Title & Quick Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Admissions & Telephony Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-dark-muted)' }}>
            Real-time database metrics for enquiries, call logs, follow-ups, and student pipeline.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="btn btn-gold btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} /> Log Call
          </button>
          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            + New Lead
          </button>
        </div>
      </div>

      {/* Metrics Row 1: Daily Activity */}
      <div className="grid-4" style={{ gap: '18px', marginBottom: '24px' }}>
        {/* Metric 1 */}
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--status-new)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark-muted)', textTransform: 'uppercase' }}>
                New Leads Today
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '4px' }}>
                {loading ? '—' : metrics?.newEnquiriesToday ?? 0}
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <Link href="/admin/contacts" style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View Contacts →
          </Link>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark-muted)', textTransform: 'uppercase' }}>
                Connected Calls Today
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '4px' }}>
                {loading ? '—' : metrics?.connectedCallsToday ?? 0}
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dark-muted)', marginTop: '12px' }}>
            Attempts: <strong>{metrics?.callAttemptsToday ?? 0}</strong>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark-muted)', textTransform: 'uppercase' }}>
                Follow-ups Due Today
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy-primary)', marginTop: '4px' }}>
                {loading ? '—' : metrics?.followUpsDueToday ?? 0}
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <Link href="/admin/follow-ups?filter=today" style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600, marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View Today’s Tasks →
          </Link>
        </div>

        {/* Metric 4 */}
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dark-muted)', textTransform: 'uppercase' }}>
                Overdue Callbacks
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: metrics?.overdueFollowUps ? '#ef4444' : 'var(--navy-primary)', marginTop: '4px' }}>
                {loading ? '—' : metrics?.overdueFollowUps ?? 0}
              </div>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <Link href="/admin/follow-ups?filter=overdue" style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600, marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Resolve Overdue →
          </Link>
        </div>
      </div>

      {/* Provenance Transparency Alert Banner */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-sm)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px',
          fontSize: '0.85rem',
          color: '#1e3a8a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} style={{ color: '#2563eb' }} />
          <span>
            <strong>Telephony Provenance Tracking: </strong>
            Website click-to-call intents today: <strong>{metrics?.websiteCallIntentsToday ?? 0}</strong>.
            Missed calls (Telephony Webhook): <strong>{metrics?.missedCallsToday ?? 0}</strong>.
            Website clicks are never falsely counted as completed calls.
          </span>
        </div>
        <Link href="/admin/telephony" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>
          Open Telephony Sandbox ↗
        </Link>
      </div>

      {/* Two Column Layout: Recent Calls & Recent Leads */}
      <div className="grid-2" style={{ gap: '24px', alignItems: 'flex-start' }}>
        {/* Left: Recent Call Activity */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                Recent Call Activity
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dark-muted)' }}>
                With explicit provenance tags
              </span>
            </div>
            <Link href="/admin/calls" className="btn btn-secondary btn-sm">
              All Calls →
            </Link>
          </div>

          {recentCalls.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-dark-muted)', fontSize: '0.875rem' }}>
              No calls logged yet today. Click &ldquo;Log Call&rdquo; to record your first phone call.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentCalls.map((cl) => (
                <div
                  key={cl.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--navy-primary)' }}>
                        {cl.parent_name || 'Website Caller'}
                      </strong>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.65rem',
                          backgroundColor:
                            cl.provenance === 'provider_verified'
                              ? '#ecfdf5'
                              : cl.provenance === 'website_click_intent'
                              ? '#eff6ff'
                              : '#fef3c7',
                          color:
                            cl.provenance === 'provider_verified'
                              ? '#065f46'
                              : cl.provenance === 'website_click_intent'
                              ? '#1e40af'
                              : '#92400e',
                        }}
                      >
                        {cl.provenance.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
                      Outcome: <strong>{cl.outcome}</strong> • {cl.notes || 'No notes'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-dark-muted)', flexShrink: 0 }}>
                    {formatToKolkata(cl.started_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Enquiries */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                Recent Enquiries
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dark-muted)' }}>
                Directly from web & phone
              </span>
            </div>
            <Link href="/admin/contacts" className="btn btn-secondary btn-sm">
              All Contacts →
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-dark-muted)', fontSize: '0.875rem' }}>
              No enquiries registered yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-primary)' }}>
                      {enq.parent_name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
                      {enq.primary_phone} • {enq.course_interest}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {enq.status}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', marginTop: '4px' }}>
                      {formatToKolkata(enq.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuickCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        onCallLogged={fetchDashboardData}
      />

      <QuickEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          fetchDashboardData();
        }}
      />
    </div>
  );
}

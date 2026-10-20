'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Radio,
  MousePointer,
  Filter,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatToKolkata } from '@/lib/utils';
import QuickCallModal from '@/components/admin/QuickCallModal';

export default function AdminCallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [provenanceFilter, setProvenanceFilter] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('');
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const fetchCalls = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (provenanceFilter) params.set('provenance', provenanceFilter);
    if (outcomeFilter) params.set('outcome', outcomeFilter);

    fetch(`/api/admin/calls?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCalls(data.calls);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCalls();
  }, [provenanceFilter, outcomeFilter]);

  return (
    <div>
      {/* Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Call Log & Telephony Provenance
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Strict separation between manual entries, website click intents, and telephony provider webhooks.
          </p>
        </div>

        <button onClick={() => setIsCallModalOpen(true)} className="btn btn-gold btn-sm">
          <Zap size={16} /> Log Manual Call
        </button>
      </div>

      {/* Provenance Filter Tabs */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} /> Provenance Filter:
          </span>

          <button
            onClick={() => setProvenanceFilter('')}
            className={`btn btn-sm ${provenanceFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Logs ({calls.length})
          </button>

          <button
            onClick={() => setProvenanceFilter('staff_reported')}
            className={`btn btn-sm ${provenanceFilter === 'staff_reported' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Staff Reported (Manual)
          </button>

          <button
            onClick={() => setProvenanceFilter('website_click_intent')}
            className={`btn btn-sm ${provenanceFilter === 'website_click_intent' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Website Click Intents
          </button>

          <button
            onClick={() => setProvenanceFilter('provider_verified')}
            className={`btn btn-sm ${provenanceFilter === 'provider_verified' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Provider Verified (Telephony)
          </button>

          <div style={{ marginLeft: 'auto', width: '180px' }}>
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="form-select"
              style={{ height: '36px', fontSize: '0.825rem' }}
            >
              <option value="">All Outcomes</option>
              <option value="connected">Connected</option>
              <option value="no_answer">No Answer</option>
              <option value="busy">Busy</option>
              <option value="switched_off">Switched Off</option>
              <option value="intent_recorded">Intent Recorded</option>
              <option value="callback_required">Callback Required</option>
              <option value="not_interested">Not Interested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Contact / Destination</th>
              <th>Direction</th>
              <th>Provenance & Source</th>
              <th>Outcome</th>
              <th>Duration</th>
              <th>Notes & Next Step</th>
              <th>Timestamp (IST)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dark-muted)' }}>
                  Loading call logs...
                </td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-dark-muted)' }}>
                  No call records found matching this filter.
                </td>
              </tr>
            ) : (
              calls.map((cl) => {
                let badgeStyle = { backgroundColor: '#fef3c7', color: '#92400e' };
                if (cl.provenance === 'provider_verified') {
                  badgeStyle = { backgroundColor: '#ecfdf5', color: '#065f46' };
                } else if (cl.provenance === 'website_click_intent') {
                  badgeStyle = { backgroundColor: '#eff6ff', color: '#1e40af' };
                }

                return (
                  <tr key={cl.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                        {cl.parent_name || 'Website Visitor'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
                        {cl.primary_phone || 'Call Intent Click'}
                      </div>
                    </td>

                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.825rem', textTransform: 'capitalize' }}>
                        {cl.direction === 'incoming' ? (
                          <PhoneIncoming size={14} style={{ color: '#059669' }} />
                        ) : (
                          <PhoneOutgoing size={14} style={{ color: '#0284c7' }} />
                        )}
                        {cl.direction}
                      </span>
                    </td>

                    <td>
                      <span className="badge" style={{ ...badgeStyle, fontSize: '0.68rem' }}>
                        {cl.provenance.replace(/_/g, ' ')}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', marginTop: '2px' }}>
                        via {cl.source.replace(/_/g, ' ')}
                      </div>
                    </td>

                    <td>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.72rem',
                          backgroundColor:
                            cl.outcome === 'connected'
                              ? '#ecfdf5'
                              : cl.outcome === 'intent_recorded'
                              ? '#f1f5f9'
                              : '#fee2e2',
                          color:
                            cl.outcome === 'connected'
                              ? '#065f46'
                              : cl.outcome === 'intent_recorded'
                              ? '#475569'
                              : '#991b1b',
                        }}
                      >
                        {cl.outcome.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.85rem' }}>
                      {cl.duration_seconds > 0 ? `${cl.duration_seconds}s` : '0s'}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-dark)', maxWidth: '280px' }}>
                        {cl.notes || '—'}
                      </div>
                      {cl.follow_up_needed === 1 && (
                        <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                          ● Follow-up required
                        </span>
                      )}
                    </td>

                    <td style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)', whiteSpace: 'nowrap' }}>
                      {formatToKolkata(cl.started_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Call Modal */}
      <QuickCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        onCallLogged={fetchCalls}
      />
    </div>
  );
}

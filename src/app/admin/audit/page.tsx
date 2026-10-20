'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, Lock, ShieldCheck } from 'lucide-react';
import { formatToKolkata } from '@/lib/utils';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (actionFilter) params.set('action', actionFilter);

    fetch(`/api/admin/audit?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.logs);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Append-Only Security Audit Trail
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Tamper-resistant audit log capturing all staff logins, contact merges, status changes, and data exports.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '12px 18px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-primary)' }}>
            Filter by Action:
          </span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="form-select"
            style={{ width: '220px', height: '36px', fontSize: '0.825rem' }}
          >
            <option value="">All Security Events</option>
            <option value="USER_LOGIN">Staff Logins</option>
            <option value="CREATE_CONTACT">Contact Created</option>
            <option value="UPDATE_CONTACT">Contact Updated</option>
            <option value="MERGE_CONTACTS">Contact Merges</option>
            <option value="LOG_CALL">Call Logs Recorded</option>
            <option value="EXPORT_CSV">CSV Exports</option>
            <option value="UPDATE_SETTINGS">Settings Changes</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp (IST)</th>
              <th>Actor</th>
              <th>Action Code</th>
              <th>Target Entity</th>
              <th>Details & Audit Context</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dark-muted)' }}>
                  Loading security audit trail...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-dark-muted)' }}>
                  No audit logs matching this filter.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)', whiteSpace: 'nowrap' }}>
                    {formatToKolkata(log.created_at)}
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                      {log.actor_name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dark-muted)', fontFamily: 'var(--font-mono)' }}>
                      {log.actor_id}
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {log.action}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                      {log.target_entity}:{log.target_id || '*'}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-dark)', maxWidth: '420px', wordBreak: 'break-word' }}>
                      {log.details || '—'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

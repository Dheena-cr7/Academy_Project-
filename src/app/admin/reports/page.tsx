'use client';

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, ShieldCheck, BarChart3, Filter } from 'lucide-react';

export default function AdminReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/reports?entity=enquiries')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.summary) {
          setSummary(data.summary);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadCsv = (entity: 'enquiries' | 'calls') => {
    window.location.href = `/api/admin/reports?entity=${entity}&format=csv`;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Admissions Analytics & Data Export
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Export contact registries and call records. All CSV exports are protected against spreadsheet formula injection.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleDownloadCsv('enquiries')}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export Contacts CSV
          </button>
          <button
            onClick={() => handleDownloadCsv('calls')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export Call Log CSV
          </button>
        </div>
      </div>

      {/* CSV Security Notice */}
      <div
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '28px',
          fontSize: '0.85rem',
          color: '#166534',
        }}
      >
        <ShieldCheck size={18} />
        <span>
          <strong>Spreadsheet Formula Injection Defense (CWE-1236 Active): </strong>
          All untrusted exported cells starting with <code>=</code>, <code>+</code>, <code>-</code>, <code>@</code>, tab, or newline are automatically escaped with single quotes to prevent code execution when opened in Excel or Google Sheets.
        </span>
      </div>

      {/* Summary Breakdowns */}
      <div className="grid-3" style={{ gap: '24px', marginBottom: '32px' }}>
        {/* Source Attribution */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '16px' }}>
            Enquiries by Lead Source
          </h3>
          {loading ? (
            <div style={{ color: 'var(--text-dark-muted)', fontSize: '0.85rem' }}>Loading source data...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {summary?.bySource?.map((s: any) => (
                <div key={s.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ textTransform: 'capitalize', color: 'var(--text-dark)' }}>{s.source}</span>
                  <span className="badge badge-gold">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Programme Interest */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '16px' }}>
            Enquiries by Programme
          </h3>
          {loading ? (
            <div style={{ color: 'var(--text-dark-muted)', fontSize: '0.85rem' }}>Loading programme data...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {summary?.byCourse?.map((c: any) => (
                <div key={c.course_interest} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-dark)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.course_interest}
                  </span>
                  <span className="badge badge-gold">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '16px' }}>
            Current Pipeline Status
          </h3>
          {loading ? (
            <div style={{ color: 'var(--text-dark-muted)', fontSize: '0.85rem' }}>Loading status data...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {summary?.byStatus?.map((st: any) => (
                <div key={st.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ textTransform: 'capitalize', color: 'var(--text-dark)' }}>
                    {st.status.replace(/_/g, ' ')}
                  </span>
                  <span className="badge badge-gold">{st.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Shield, UserX, Key, CheckCircle, AlertCircle, X } from 'lucide-react';
import { formatToKolkata } from '@/lib/utils';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New staff form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('counsellor');

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStaff = () => {
    setLoading(true);
    fetch('/api/admin/staff')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStaffList(data.staff);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: currentStatus === 1 ? false : true }),
      });
      if (res.ok) fetchStaff();
    } catch {
      alert('Failed to update staff status');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullName, email, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create staff account');
      }

      setSuccessMessage('Staff account created successfully!');
      setTimeout(() => {
        setIsAddOpen(false);
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        fetchStaff();
      }, 1000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error creating staff');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
            Staff & Permissions (RBAC)
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
            Role-based access control for admission counsellors, content editors, managers, and auditors.
          </p>
        </div>

        <button onClick={() => setIsAddOpen(true)} className="btn btn-gold btn-sm">
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      {/* Staff Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff Name & Username</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Account Status</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dark-muted)' }}>
                  Loading staff accounts...
                </td>
              </tr>
            ) : (
              staffList.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>
                      {s.full_name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
                      @{s.username}
                    </div>
                  </td>

                  <td style={{ fontSize: '0.85rem' }}>{s.email || '—'}</td>

                  <td>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                      {s.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.72rem',
                        backgroundColor: s.is_active ? '#ecfdf5' : '#fee2e2',
                        color: s.is_active ? '#065f46' : '#991b1b',
                      }}
                    >
                      {s.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)' }}>
                    {formatToKolkata(s.created_at)}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {s.username !== 'admin' && (
                      <button
                        onClick={() => handleToggleActive(s.id, s.is_active)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        {s.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-primary)' }}>
                Add New Staff Member
              </h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px', borderRadius: '4px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <CheckCircle size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="st_name">Full Name</label>
                <input
                  id="st_name"
                  type="text"
                  required
                  placeholder="e.g. R. Murugan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="st_user">Login Username</label>
                  <input
                    id="st_user"
                    type="text"
                    required
                    placeholder="e.g. murugan"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="st_pass">Initial Password</label>
                  <input
                    id="st_pass"
                    type="password"
                    required
                    placeholder="Strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="st_email">Staff Email (Optional)</label>
                  <input
                    id="st_email"
                    type="email"
                    placeholder="staff@kalaivani.org.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="st_role">System Role</label>
                  <select
                    id="st_role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-select"
                  >
                    <option value="counsellor">Counsellor (Calls & Follow-ups)</option>
                    <option value="manager">Manager (Pipeline & Export)</option>
                    <option value="content_editor">Content Editor (CMS only)</option>
                    <option value="auditor">Auditor (Read-only)</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" disabled={saving} className="btn btn-gold" style={{ flex: 1 }}>
                  {saving ? 'Creating Account...' : 'Create Staff User'}
                </button>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

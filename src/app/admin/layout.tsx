'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  CalendarClock,
  GitBranch,
  FileEdit,
  Radio,
  FileSpreadsheet,
  UserCheck,
  ShieldAlert,
  LogOut,
  Plus,
  Zap,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import QuickCallModal from '@/components/admin/QuickCallModal';
import QuickEnquiryModal from '@/components/QuickEnquiryModal';

interface AuthUserProfile {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState(!isLoginPage);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--ivory-muted)', borderTopColor: 'var(--navy-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-dark-muted)', fontSize: '0.9rem' }}>Verifying staff credentials...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Contacts & Leads', href: '/admin/contacts', icon: Users },
    { label: 'Call Log & Provenance', href: '/admin/calls', icon: PhoneCall },
    { label: 'Follow-ups & Tasks', href: '/admin/follow-ups', icon: CalendarClock },
    { label: 'Pipeline Stages', href: '/admin/pipeline', icon: GitBranch },
    { label: 'Content CMS', href: '/admin/cms', icon: FileEdit },
    { label: 'Telephony & Webhooks', href: '/admin/telephony', icon: Radio },
    { label: 'Reports & Export', href: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Staff Management', href: '/admin/staff', icon: UserCheck },
    { label: 'Security Audit Log', href: '/admin/audit', icon: ShieldAlert },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--navy-darkest)',
          color: 'var(--ivory-white)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 950,
          transition: 'transform var(--transition-normal)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Brand */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--gold-primary)', color: '#070e1b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ivory-white)' }}>
                Kalaivani CRM
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold-light)', textTransform: 'uppercase' }}>
                Admission Office
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }}
            className="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#070e1b' : 'var(--text-light-muted)',
                      backgroundColor: isActive ? 'var(--gold-primary)' : 'transparent',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Identity & Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ivory-white)' }}>
              {user?.fullName || 'Staff Member'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                {user?.role?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                flex: 1,
                fontSize: '0.75rem',
                color: 'var(--text-light-muted)',
                padding: '6px',
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '4px',
              }}
            >
              Public Site ↗
            </Link>
            <button
              onClick={handleLogout}
              style={{
                fontSize: '0.75rem',
                color: '#f87171',
                padding: '6px 10px',
                background: 'none',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Logout session"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-main">
        {/* Top Navbar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--ivory-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 900,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy-primary)', display: 'none' }}
              className="admin-menu-toggle"
              aria-label="Open Sidebar Menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dark-muted)' }}>
              Welcome back, <strong style={{ color: 'var(--navy-primary)' }}>{user?.fullName}</strong>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="btn btn-gold btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={14} /> Log a Call
            </button>
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> Add Enquiry
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '28px', flex: 1 }}>{children}</div>
      </div>

      {/* Modals */}
      <QuickCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        onCallLogged={() => {
          // Trigger route refresh if on calls/contacts page
          router.refresh();
        }}
      />

      <QuickEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          router.refresh();
        }}
      />

    </div>
  );
}

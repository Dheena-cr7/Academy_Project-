import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumbs" style={{ padding: '16px 0', fontSize: '0.85rem' }}>
      <div className="container">
        <ol
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            listStyle: 'none',
            color: 'var(--text-dark-muted)',
          }}
        >
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--navy-primary)',
                fontWeight: 500,
              }}
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronRight size={13} style={{ color: 'var(--gold-dark)' }} />
                {item.href && !isLast ? (
                  <Link href={item.href} style={{ color: 'var(--navy-primary)', fontWeight: 500 }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--text-dark)', fontWeight: 600 }} aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

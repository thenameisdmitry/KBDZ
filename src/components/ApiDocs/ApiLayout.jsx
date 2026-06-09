import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './ApiLayout.module.css';

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV = [
  { id: 'intro', label: 'Introduction', href: '/api', type: 'page' },
  { id: 'auth', label: 'Base URL & Authentication', href: '/api/authentication', type: 'page' },

  { id: 'label-refdata', label: 'Reference Data', type: 'label' },

  {
    id: 'accounts', label: 'Accounts', href: '/api/accounts', type: 'section',
    children: [
      { id: 'list-accounts',   method: 'GET',    label: 'List accounts',      anchor: '#list-accounts' },
      { id: 'get-account',     method: 'GET',    label: 'Get account by ID',  anchor: '#get-account' },
      { id: 'create-account',  method: 'POST',   label: 'Create account',     anchor: '#create-account' },
      { id: 'update-account',  method: 'PATCH',  label: 'Update account',     anchor: '#update-account' },
      { id: 'remove-account',  method: 'DELETE', label: 'Remove account',     anchor: '#remove-account' },
    ],
  },
  {
    id: 'portfolios', label: 'Portfolios', href: '/api/portfolios', type: 'section',
    children: [
      { id: 'list-portfolios',   method: 'GET',    label: 'List portfolios',      anchor: '#list-portfolios' },
      { id: 'get-portfolio',     method: 'GET',    label: 'Get portfolio by ID',  anchor: '#get-portfolio' },
      { id: 'create-portfolio',  method: 'POST',   label: 'Create portfolio',     anchor: '#create-portfolio' },
      { id: 'update-portfolio',  method: 'PATCH',  label: 'Update portfolio',     anchor: '#update-portfolio' },
      { id: 'remove-portfolio',  method: 'DELETE', label: 'Remove portfolio',     anchor: '#remove-portfolio' },
    ],
  },

  { id: 'label-finoperation', label: 'Financial Operations', type: 'label' },

  {
    id: 'transactions', label: 'Transactions', href: '/api/transactions', type: 'section',
    children: [
      { id: 'list-transactions',   method: 'GET',    label: 'List transactions',      anchor: '#list-transactions' },
      { id: 'get-transaction',     method: 'GET',    label: 'Get transaction by ID',  anchor: '#get-transaction' },
      { id: 'create-transaction',  method: 'POST',   label: 'Create transaction',     anchor: '#create-transaction' },
      { id: 'update-transaction',  method: 'PATCH',  label: 'Update transaction',     anchor: '#update-transaction' },
      { id: 'remove-transaction',  method: 'DELETE', label: 'Remove transaction',     anchor: '#remove-transaction' },
    ],
  },

  { id: 'label-legal', label: 'Legal & Compliance', type: 'label' },
 
  {
    id: 'agreements', label: 'Credit Agreements', href: '/api/agreements', type: 'section',
    children: [
      { id: 'list-agreements',   method: 'GET',    label: 'List credit agreements',      anchor: '#list-agreements' },
      { id: 'get-agreement',     method: 'GET',    label: 'Get credit agreement by ID',  anchor: '#get-agreement' },
      { id: 'create-agreement',  method: 'POST',   label: 'Create credit agreement',     anchor: '#create-agreement' },
      { id: 'update-agreement',  method: 'PATCH',  label: 'Update credit agreement',     anchor: '#update-agreement' },
      { id: 'remove-agreement',  method: 'DELETE', label: 'Remove credit agreement',     anchor: '#remove-agreement' },
    ],
  },

];

const METHOD_MINI = {
  GET:    { bg: '#d1fae5', color: '#065f46' },
  POST:   { bg: '#dbeafe', color: '#1e40af' },
  PATCH:  { bg: '#fef3c7', color: '#78350f' },
  DELETE: { bg: '#fee2e2', color: '#991b1b' },
};

function MethodPill({ method }) {
  const s = METHOD_MINI[method] || METHOD_MINI.GET;
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: '10px',
      fontWeight: 900,
      padding: '2px 5px',
      borderRadius: '3px',
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.06em',
      flexShrink: 0,
    }}>
      {method}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ApiLayout({ children }) {
  const location = useLocation();
  const [activeHash, setActiveHash] = useState('');

  // Sync hash on navigation
  useEffect(() => {
    setActiveHash(location.hash || '');
  }, [location.hash, location.pathname]);

  // Scroll-spy: update active hash as user scrolls
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  const isPageActive = (href) =>
    location.pathname === href || location.pathname === href + '/';

  const isSectionExpanded = (item) =>
    item.type === 'section' && isPageActive(item.href);

  return (
    <div className={styles.container}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <div className={styles.sidebarDot}>
              <div className={styles.sidebarDotInner} />
            </div>
            <span className={styles.sidebarTitle}>API Reference</span>
          </div>
          <span className={styles.sidebarVersion}>v1.0.0</span>
        </div>
        
        <nav className={styles.nav}>
          <div className={styles.navGroupLabel}>Getting Started</div>
       

          {NAV.map((item) => {

              if (item.type === 'label') 
                {
              return (
                <div key={item.id} className={styles.navGroupLabel} style={{ marginTop: '16px' }}>
                {item.label}
                </div>
                    );
             }  

            if (item.type === 'page') {
              const active = isPageActive(item.href);
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                >
                  {item.label}
                </Link>
              );
            }

            const expanded = isSectionExpanded(item);
            const active = expanded;

            return (
              <div key={item.id} className={styles.navSection}>
                <Link
                  to={item.href}
                  className={`${styles.navSectionHeader} ${active ? styles.navSectionHeaderActive : ''}`}
                >
                  {item.label}
                  <span className={`${styles.navChevron} ${expanded ? styles.navChevronOpen : ''}`}>▶</span>
                </Link>

                {expanded && item.children && (
                  <div className={styles.navChildren}>
                    {item.children.map((child) => {
                      const childActive = activeHash === child.anchor;
                      return (
                        <a
                          key={child.id}
                          href={`${item.href}${child.anchor}`}
                          className={`${styles.navChild} ${childActive ? styles.navChildActive : ''}`}
                        >
                          <MethodPill method={child.method} />
                          <span className={styles.navChildLabel}>{child.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ── Content ── */}
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}

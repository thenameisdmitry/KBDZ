import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './ApiLayout.module.css';

// ─── Nav structure ────────────────────────────────────────────────────────────
// Paths are site-root relative and get the site baseUrl applied at render time,
// so moving the site to another domain or sub-path needs no edits here.
const NAV = [
  { id: 'label-start', label: 'Getting Started', type: 'label' },
  { id: 'intro', label: 'Introduction', href: '/api', type: 'page' },
  { id: 'auth', label: 'Base URL & Authentication', href: '/api/authentication', type: 'page' },
  { id: 'conventions', label: 'Conventions', href: '/api/conventions', type: 'page' },
  { id: 'errors', label: 'Errors', href: '/api/errors', type: 'page' },

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

  {
    id: 'custodians', label: 'Custodians', href: '/api/custodians', type: 'section',
    children: [
      { id: 'list-custodians',   method: 'GET',    label: 'List custodians',      anchor: '#list-custodians' },
      { id: 'get-custodian',     method: 'GET',    label: 'Get custodian by ID',  anchor: '#get-custodian' },
      { id: 'create-custodian',  method: 'POST',   label: 'Create custodian',     anchor: '#create-custodian' },
      { id: 'update-custodian',  method: 'PATCH',  label: 'Update custodian',     anchor: '#update-custodian' },
      { id: 'remove-custodian',  method: 'DELETE', label: 'Remove custodian',     anchor: '#remove-custodian' },
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

  {
    id: 'payments', label: 'Payments', href: '/api/payments', type: 'section',
    children: [
      { id: 'list-payments',   method: 'GET',    label: 'List payments',      anchor: '#list-payments' },
      { id: 'get-payment',     method: 'GET',    label: 'Get payment by ID',  anchor: '#get-payment' },
      { id: 'create-payment',  method: 'POST',   label: 'Create payment',     anchor: '#create-payment' },
      { id: 'update-payment',  method: 'PATCH',  label: 'Update payment',     anchor: '#update-payment' },
      { id: 'remove-payment',  method: 'DELETE', label: 'Remove payment',     anchor: '#remove-payment' },
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

  { id: 'label-spec', label: 'Specification', type: 'label' },

  { id: 'spec', label: 'OpenAPI Specification', href: '/api/specification', type: 'page' },
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
  const baseUrl = useBaseUrl('/');
  const [activeHash, setActiveHash] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  // Resolve a site-root path against the site baseUrl, without a double prefix.
  const withBase = (href) => `${baseUrl.replace(/\/$/, '')}${href}`;

  // Sync hash on navigation.
  useEffect(() => {
    setActiveHash(location.hash || '');
  }, [location.hash, location.pathname]);

  // Close the mobile nav whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  // Scroll-spy: update the active hash as the reader scrolls.
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

  const isPageActive = (href) => {
    const resolved = withBase(href);
    return location.pathname === resolved || location.pathname === `${resolved}/`;
  };

  const isSectionExpanded = (item) =>
    item.type === 'section' && isPageActive(item.href);

  const activeItem = NAV.find(
    (item) => item.href && isPageActive(item.href)
  );

  return (
    <div className={styles.container}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${navOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <div className={styles.sidebarDot}>
              <div className={styles.sidebarDotInner} />
            </div>
            <span className={styles.sidebarTitle}>API Reference</span>
          </div>
          <span className={styles.sidebarVersion}>v1.0.0</span>
        </div>

        {/* Mobile-only toggle. Hidden on desktop, where the nav is always open. */}
        <button
          type="button"
          className={styles.navToggle}
          onClick={() => setNavOpen((open) => !open)}
          aria-expanded={navOpen}
        >
          <span>{activeItem ? activeItem.label : 'Browse the API'}</span>
          <span className={`${styles.navToggleChevron} ${navOpen ? styles.navToggleChevronOpen : ''}`}>▾</span>
        </button>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            if (item.type === 'label') {
              return (
                <div key={item.id} className={styles.navGroupLabel}>
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

            return (
              <div key={item.id} className={styles.navSection}>
                <Link
                  to={item.href}
                  className={`${styles.navSectionHeader} ${expanded ? styles.navSectionHeaderActive : ''}`}
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
                          href={`${withBase(item.href)}${child.anchor}`}
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

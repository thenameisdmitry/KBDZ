import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';

const HIGHLIGHTS = [
  'RESTful design with consistent patterns',
  'OAuth 2.0 Bearer token authentication on PROD and UAT',
  'Full CRUD operations for Reference Data and Asset Management',
  'Structured JSON request/response schemas with live examples',
  'Standard HTTP status codes and error response conventions',
];

function CardItem({ icon, title, desc, href, disabled }) {
  const card = (
    <div
      style={{
        padding: '20px',
        border: `3px solid ${disabled ? '#2a2a2a' : '#e8edf5'}`,
        borderRadius: '9px',
        background: disabled ? 'transparent' : '#fafbfd',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'default' : 'pointer',
        maxWidth: '300px',
        minWidth: '190px',
        height: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '4px',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = '#6a0aaf'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
      onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'none'; }}}
    >
      <div style={{ fontSize: '25px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: disabled ? '#ffffffff' : '#0f172a', marginBottom: '2px', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>        {title}
        {disabled && <span style={{ fontSize: '15px', fontWeight: 500, color: '#cfcfcfff', marginLeft: '8px', fontFamily: "'IBM Plex Mono', monospace" }}>SOON</span>}
      </div>
      <div style={{ fontSize: '13px', color: disabled ? '#ffffffff' :'#515151ff', lineHeight: 1.5, fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>{desc}</div>
    </div>
  );
  return disabled ? card : <Link to={href} style={{ textDecoration: 'none' }}>{card}</Link>;
}

export default function ApiIntroduction() {
  return (
    <Layout
      title="DZ API Reference"
      description="Complete API reference for the DZ Portfolio."
    >
      <ApiLayout>
        {/* ── Page header ── */}
        <div className={styles.pageHeader}>
          {/*<div className={styles.pageHeaderMeta}>DZ API</div>*/}
          <h1 className={styles.pageTitle}>API Reference Portfolio</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '16px' }}>
            This API portal mockup demonstrates my ability to design, build, and maintain developer-facing API documentation portals. 
            It showcases how third-party developers can integrate with a platform through structured, clear API documentation.
          </p>
          
          <p className={styles.pageSubtitle} style={{ marginBottom: '16px' }}>
            The content reflects the type of API documentation I created and maintained in a fintech environment using Swagger/OpenAPI. The 
            examples cover common business domains such as Reference Data Management (<b>Accounts</b> and <b>Portfolios</b>) and Asset Management (<b>Transactions</b> and <b>Payments</b>).
          </p>

          <p className={styles.pageSubtitle} style={{ marginBottom: '16px' }}>
            For demonstration purposes, all examples use the base URL: <b>https://api.dzenterprise.io/v1</b>
          </p>

          <div className={styles.pageAccent} />

        </div>

{/* ── Quick-nav cards ── */}
<h2 style={{ fontSize: '1px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Getting Started
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="🔐" title="Authentication" desc="OAuth 2.0 Bearer tokens for Prod and UAT environments." href="/api/authentication" />
</div>

<h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Reference Data
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="👤" title="Accounts" desc="Manage your Custodian Accounts with full CRUD support." href="/api/accounts" />
  <CardItem icon="📊" title="Portfolios" desc="Manage your Portfolios across all Custodians." href="/api/portfolios" />
  <CardItem icon="🏛️" title="Custodians" desc="Manage Custodians and their associated data." href={null} disabled />
</div>

<h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Financial Operations
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="💳" title="Transactions" desc="Submit and process Transactions (Wires, Money Market, Securities, Margin calls, etc.)." href="/api/transactions" />
  <CardItem icon="🏦" title="Payments" desc="Payment initiation and settlement. Currently in development." href={null} disabled />
</div>

<h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Legal & Compliance
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="📋" title="Credit Agreements" desc="Manage Credit Agreements linked to your Accounts." href="/api/agreements" />
  <CardItem icon="📈" title="Collateral Agreements" desc="Collateral Agreement management. Currently in development." href={null} disabled />
</div>

        {/* ── What this demonstrates ── */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e8edf5',
            borderRadius: '9px',
            padding: '28px 32px',
            marginBottom: '36px',
          }}
        >
          <h2
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 18px',
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            }}
          >
            What this section covers
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {HIGHLIGHTS.map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '7px 0',
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: 1.5,
                  borderBottom: i < HIGHLIGHTS.length - 1 ? '1px solid #eef2f8' : 'none',
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                }}
              >
                <span style={{ color: '#6a0aaf', fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── CTA buttons ── */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/api/authentication"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              background: '#0b0e1c',
              color: '#ffffff',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: "'IBM Plex Sans', sans-serif",
              transition: 'background 0.15s',
            }}
          >
            Get started →
          </Link>
          <Link
            to="/api/accounts"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              border: '0px solid #6a0aaf',
              color: '#f9f9f9ff',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: "'IBM Plex Sans', sans-serif",
              background: '#838383',
              transition: 'border-color 0.15s',
            }}
          >
            Browse endpoints
          </Link>
        </div>
      </ApiLayout>
    </Layout>
  );
}

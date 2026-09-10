import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';
import { PROSE, INLINE_CODE } from '@site/src/components/ApiDocs/textStyles';

const HIGHLIGHTS = [
  'RESTful design with consistent patterns',
  'OAuth 2.0 Bearer token authentication on production and UAT',
  'Full CRUD coverage for reference data and asset management',
  'Structured JSON request and response schemas with runnable examples',
  'Standard HTTP status codes and error response conventions',
  'A machine-readable OpenAPI 3.0 specification the reference is generated from',
];

function CardItem({ icon, title, desc, href, disabled }) {
  const card = (
    <div
      style={{
        padding: '20px',
        border: `1px solid ${disabled ? '#2a2a2a' : '#3a3f52'}`,
        borderRadius: '9px',
        background: disabled ? 'transparent' : '#161a24',
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
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = '#a648ea'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
      onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.borderColor = '#3a3f52'; e.currentTarget.style.transform = 'none'; }}}
    >
      <div style={{ fontSize: '25px', marginBottom: '4px', opacity: disabled ? 0.5 : 1 }}>{icon}</div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: disabled ? '#8a8f9c' : '#fafafa', marginBottom: '2px', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
        {title}
        {disabled && (
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24', background: '#2a1f00', border: '1px solid #78350f', borderRadius: '4px', padding: '2px 6px', marginLeft: '8px', letterSpacing: '0.08em', fontFamily: "'IBM Plex Mono', monospace" }}>
            SOON
          </span>
        )}
      </div>
      <div style={{ fontSize: '13px', color: disabled ? '#8a8f9c' : '#c9ccd4', lineHeight: 1.5, fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>{desc}</div>
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
            This portal is a working mockup of a developer-facing API reference. It shows how I design,
            build, and maintain documentation that a third-party developer can integrate against without
            a support ticket.
          </p>
          
          <p className={styles.pageSubtitle} style={{ marginBottom: '16px' }}>
            The content mirrors the API documentation I wrote and maintained in a fintech environment with
            Swagger/OpenAPI. The examples cover the usual business domains: reference data
            (<b>Accounts</b>, <b>Portfolios</b>) and asset management (<b>Transactions</b>, <b>Payments</b>).
          </p>

          <p className={styles.pageSubtitle} style={{ marginBottom: '16px' }}>
            All examples use the demonstration base URL <b>https://api.dzenterprise.io/v1</b>. The API is not live.
          </p>

          <div className={styles.pageAccent} />

        </div>

{/* ── Quick-nav cards ── */}
<h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Getting Started
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="🔐" title="Authentication" desc="OAuth 2.0 Bearer tokens for the production and UAT environments." href="/api/authentication" />
  <CardItem icon="📐" title="Conventions" desc="Pagination, filtering, rate limits, idempotency, versioning, and data formats." href="/api/conventions" />
  <CardItem icon="⚠️" title="Errors" desc="Error envelope, the full status code catalogue, and safe retry patterns." href="/api/errors" />
  <CardItem icon="📄" title="OpenAPI Specification" desc="The machine-readable contract, and the reference generated from it." href="/api/specification" />
</div>

<h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Reference Data
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="👤" title="Accounts" desc="Create, read, update, and delete Custodian Accounts." href="/api/accounts" />
  <CardItem icon="📊" title="Portfolios" desc="Manage Portfolios across all Custodians." href="/api/portfolios" />
  <CardItem icon="🏛️" title="Custodians" desc="Banks, prime brokers, and clearing houses that hold your assets." href="/api/custodians" />
</div>

<h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Financial Operations
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="💳" title="Transactions" desc="Submit and process Transactions: wires, money market, securities, FX, cashflows, loan tranches." href="/api/transactions" />
  <CardItem icon="🏦" title="Payments" desc="Initiate and settle Payments over SWIFT, SEPA, Faster Payments, and internal rails." href="/api/payments" />
</div>

<h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace" }}>
  Legal & Compliance
</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: '14px', marginBottom: '40px' }}>
  <CardItem icon="📋" title="Credit Agreements" desc="Manage Credit Agreements linked to your Accounts." href="/api/agreements" />
</div>

        {/* ── What this demonstrates ── */}
        <div
          style={{
            background: '#161a24',
            border: '1px solid #3a3f52',
            borderRadius: '9px',
            padding: '28px 32px',
            marginBottom: '36px',
          }}
        >
          <h2
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#fafafa',
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
                  color: '#c9ccd4',
                  lineHeight: 1.5,
                  borderBottom: i < HIGHLIGHTS.length - 1 ? '1px solid #2a2f3d' : 'none',
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                }}
              >
                <span style={{ color: '#a648ea', fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── CTA buttons ── */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            to="/api/authentication"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              background: '#6a0aaf',
              color: '#ffffff',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: "'IBM Plex Sans', sans-serif",
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
              border: '1px solid #3a3f52',
              color: '#e2e8f8',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            Browse endpoints
          </Link>

          <a
            href={useBaseUrl('/openapi/dz-api.yaml')}
            download="dz-api.yaml"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              border: '1px solid #3a3f52',
              color: '#e2e8f8',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            OpenAPI 3.0 spec (YAML)
          </a>
        </div>

        <p style={{ ...PROSE, marginTop: '18px', fontSize: '14px', color: '#a0a0a0' }}>
          The reference under{' '}
          <Link to="/api/specification" style={{ color: '#a78bfa' }}>Specification</Link>{' '}
          is generated from that file with{' '}
          <code style={INLINE_CODE}>docusaurus-plugin-openapi-docs</code>, so the contract and the
          documentation cannot drift apart.
        </p>

      </ApiLayout>
    </Layout>
  );
}

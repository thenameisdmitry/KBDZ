import React from 'react';
import MethodBadge from './MethodBadge';

/**
 * EndpointSection
 * Wraps a single endpoint block — header + all child content.
 * The `id` prop becomes the anchor target for sidebar scroll-spy.
 *
 * @param {string} id      — anchor id, e.g. "list-accounts"
 * @param {string} method  — GET | POST | PATCH | DELETE
 * @param {string} path    — e.g. "GET /accounts"
 * @param {string} title   — human-readable title
 * @param {string} description — short description sentence
 */
export default function EndpointSection({ id, method, path, title, description, children, noDivider = false }) {  return (
    <section
      id={id}
      style={{
        paddingTop: '15px',
        marginTop: '0',
        scrollMarginTop: 'calc(var(--ifm-navbar-height, 60px) + 20px)',
      }}
    >
      {/* Divider */}
      {!noDivider && (
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, #6a0aaf 0%, #6a0aaf 100%)',
            marginBottom: '36px',
          }}
        />
      )}

      {/* Pill + path row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '14px',
          flexWrap: 'wrap',
        }}
      >
        <MethodBadge method={method} large />
        <code
          style={{
            fontSize: '15px',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#000000ff',
            background: '#f1f5f9',
            padding: '4px 12px',
            borderRadius: '5px',
            border: '1px solid #e2e8f0',
            fontWeight: 500,
          }}
        >
          {path}
        </code>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '21px',
          fontWeight: 700,
          color: '#f0f0f0',
          margin: '0 0 8px',
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: '15px',
            color: '#f0f0f0',
            lineHeight: 1.65,
            margin: '0 0 24px',
            maxWidth: '560px',
          }}
        >
          {description}
        </p>
      )}

      {children}
    </section>
  );
}

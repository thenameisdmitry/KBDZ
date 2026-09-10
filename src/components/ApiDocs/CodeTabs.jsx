import React, { useState, useCallback } from 'react';

const tabBase = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '9px 16px',
  fontSize: '12px',
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.03em',
  transition: 'color 0.15s',
  borderBottom: '2px solid transparent',
  outline: 'none',
};

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (!code) return;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(done).catch(() => {});
      return;
    }
    // Fallback for non-secure contexts, where the Clipboard API is unavailable.
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* nothing we can do */ }
    document.body.removeChild(ta);
  }, [code]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'transparent',
        border: '1px solid #3a3f52',
        borderRadius: '5px',
        color: copied ? '#4ade80' : '#a0a0a0',
        cursor: 'pointer',
        padding: '4px 9px',
        fontSize: '11px',
        fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: '0.04em',
        transition: 'color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = '#ffffff'; }}
      onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = '#a0a0a0'; }}
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 3.5v-.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

/**
 * CodeTabs
 * Props:
 *   curl       — string (cURL snippet)
 *   python     — string (Python snippet)
 *   javascript — string (JavaScript / TypeScript snippet)
 *   label      — string (optional header label, default "Request")
 */
export default function CodeTabs({ curl, python, javascript, label = 'Request' }) {
  const tabs = [
    curl && { id: 'curl', label: 'cURL', code: curl },
    python && { id: 'python', label: 'Python', code: python },
    javascript && { id: 'javascript', label: 'JavaScript', code: javascript },
  ].filter(Boolean);

  const [active, setActive] = useState(tabs[0]?.id);
  const code = (tabs.find((t) => t.id === active) || tabs[0])?.code;

  return (
    <div
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #838383',
        marginTop: '14px',
        marginBottom: '24px',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#131829',
          borderBottom: '1px solid #838383',
          padding: '0 8px 0 4px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              style={{
                ...tabBase,
                color: active === tab.id ? '#9129baff' : '#8a93a8',
                fontWeight: active === tab.id ? 600 : 400,
                borderBottom: `2px solid ${active === tab.id ? '#9129baff' : 'transparent'}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '10px',
              color: '#f0f0f0',
              fontFamily: 'monospace',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
          <CopyButton code={code} />
        </div>
      </div>

      {/* Code */}
      <pre
        style={{
          margin: 0,
          padding: '20px 24px',
          background: '#0d1117',
          color: '#f0f0f0',
          fontSize: '12.5px',
          lineHeight: 1.72,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}
      >
        <code style={{ fontFamily: 'inherit', background: 'none', padding: 0 }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

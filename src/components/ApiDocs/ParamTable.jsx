import React from 'react';

export default function ParamTable({ params, caption }) {
  return (
    <div style={{ overflowX: 'auto', margin: '14px 0 28px' }}>
      {caption && (
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#a0a0a0',
          marginBottom: '8px',
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          {caption}
        </div>
      )}

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      }}>
        <thead>
          <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
            {['Parameter', 'Type', 'Required', 'Description'].map((h) => (
              <th key={h} style={{
                textAlign: 'left',
                padding: '12px 18px',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#a0a0a0',
                fontFamily: "'IBM Plex Mono', monospace",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <tr key={i} style={{
              borderBottom: i < params.length - 1 ? '1px solid #2a2a2a' : 'none',
              background: 'transparent',
            }}>
              <td style={{ padding: '13px 18px', width: '160px' }}>
                <code style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  color: '#a78bfa',
                  background: '#1e1a2e',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}>
                  {p.name}
                </code>
              </td>
              <td style={{ padding: '13px 18px', width: '100px' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  color: '#a0a0a0',
                }}>
                  {p.type}
                </span>
              </td>
              <td style={{ padding: '13px 18px', width: '100px' }}>
                {p.required
                  ? <span style={{ color: '#f87171', fontSize: '13px', fontWeight: 600 }}>Required</span>
                  : <span style={{ color: '#909090ff', fontSize: '13px' }}>Optional</span>
                }
              </td>
              <td style={{ padding: '13px 18px', color: '#e0e0e0', fontSize: '14px', lineHeight: 1.5 }}>
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React from 'react';

/**
 * FieldTable
 * Documents the fields of a response object. Mirrors ParamTable, but drops the
 * Required column (a response field is either present or documented as nullable)
 * and carries the field type instead.
 *
 * @param {Array} fields — [{ name, type, description }]
 * @param {string} caption — small uppercase label above the table
 */
export default function FieldTable({ fields, caption = 'Response fields' }) {
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
            {['Field', 'Type', 'Description'].map((h) => (
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
          {fields.map((f, i) => (
            <tr key={f.name} style={{
              borderBottom: i < fields.length - 1 ? '1px solid #2a2a2a' : 'none',
              background: 'transparent',
            }}>
              <td style={{ padding: '13px 18px', width: '200px' }}>
                <code style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  color: '#a78bfa',
                  background: '#1e1a2e',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}>
                  {f.name}
                </code>
              </td>
              <td style={{ padding: '13px 18px', width: '120px' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  color: '#a0a0a0',
                }}>
                  {f.type}
                </span>
              </td>
              <td style={{ padding: '13px 18px', color: '#e0e0e0', fontSize: '14px', lineHeight: 1.5 }}>
                {f.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

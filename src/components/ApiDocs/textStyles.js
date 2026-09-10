/**
 * Shared text styles for the API reference pages.
 * Kept in one place so headings, prose, and inline code stay identical
 * across every page in the section.
 */

export const H2 = {
  fontSize: '22px',
  fontWeight: 900,
  color: '#f0f0f0',
  margin: '40px 0 12px',
  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
  letterSpacing: '-0.01em',
};

export const H3 = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#f0f0f0',
  margin: '28px 0 4px',
  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
};

export const PROSE = {
  fontSize: '15px',
  color: '#f0f0f0',
  lineHeight: 1.68,
  margin: '0 0 20px',
  maxWidth: '900px',
  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
};

/** Inline code chip. Matches the code chips used in ParamTable and FieldTable. */
export const INLINE_CODE = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '12.5px',
  background: '#1e1a2e',
  padding: '2px 7px',
  borderRadius: '4px',
  color: '#a78bfa',
};

/** Small uppercase label used above tables and blocks. */
export const CAPTION = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#a0a0a0',
  marginBottom: '8px',
  fontFamily: "'IBM Plex Mono', monospace",
};

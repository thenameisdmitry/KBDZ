import React from 'react';
import Layout from '@theme/Layout';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import FieldTable from '@site/src/components/ApiDocs/FieldTable';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';
import { H2, H3, PROSE, INLINE_CODE, CAPTION } from '@site/src/components/ApiDocs/textStyles';

// ─── Error catalogue ──────────────────────────────────────────────────────────
const ERRORS = [
  {
    status: 400,
    code: 'invalid_request',
    meaning: 'The request could not be parsed: malformed JSON, an unknown query parameter, or a missing required field.',
    fix: 'Validate the request body against the schema and check that Content-Type is application/json.',
  },
  {
    status: 401,
    code: 'unauthorized',
    meaning: 'The Bearer token is missing, malformed, or has expired.',
    fix: 'Request a new token from the auth server and retry. Tokens expire after 3600 seconds.',
  },
  {
    status: 403,
    code: 'insufficient_scope',
    meaning: 'The token is valid but does not carry the scope this endpoint requires.',
    fix: 'Request a token with the required scope (for example api:write for POST, PATCH, and DELETE).',
  },
  {
    status: 404,
    code: 'not_found',
    meaning: 'No resource exists with the supplied identifier, or it is outside your environment.',
    fix: 'Check the identifier and confirm you are calling the environment the resource belongs to.',
  },
  {
    status: 409,
    code: 'conflict',
    meaning: 'The request conflicts with the current state of the resource, for example deleting an Account that still holds an open Position.',
    fix: 'Fetch the resource, resolve the conflicting state, then retry.',
  },
  {
    status: 422,
    code: 'validation_failed',
    meaning: 'The request was well formed but a field value is not acceptable, for example an unknown currency code or a maturity date in the past.',
    fix: 'Read the details array: it names every field that failed and why.',
  },
  {
    status: 429,
    code: 'rate_limit_exceeded',
    meaning: 'You have sent more requests than your plan allows in the current window.',
    fix: 'Back off and retry after the number of seconds given in the Retry-After header.',
  },
  {
    status: 500,
    code: 'internal_error',
    meaning: 'An unexpected error occurred on our side. The request was not processed.',
    fix: 'Retry with exponential backoff. If it persists, contact support with the request_id.',
  },
  {
    status: 503,
    code: 'service_unavailable',
    meaning: 'The service is temporarily unavailable, usually during a scheduled maintenance window.',
    fix: 'Retry after the interval given in the Retry-After header.',
  },
];

const STATUS_TONE = {
  4: { bg: '#2a1f00', color: '#fbbf24', border: '#78350f' },
  5: { bg: '#2a0a0a', color: '#f87171', border: '#7f1d1d' },
};

const ERROR_FIELDS = [
  { name: 'error', type: 'string', description: 'Stable, machine-readable error code. Switch on this value, never on the message.' },
  { name: 'message', type: 'string', description: 'Human-readable explanation. Wording may change between releases, so do not parse it.' },
  { name: 'status', type: 'integer', description: 'HTTP status code, repeated in the body for clients that log bodies only.' },
  { name: 'request_id', type: 'string', description: 'Identifier for this call. Quote it in any support request.' },
  { name: 'details', type: 'array', description: 'Present on 422 only. One entry per rejected field, each with field and issue.' },
];

const VALIDATION_BODY = {
  error: 'validation_failed',
  message: 'The request contains one or more invalid fields.',
  status: 422,
  request_id: 'req_9f3c21a7',
  details: [
    { field: 'currency', issue: 'Must be a valid ISO 4217 code.' },
    { field: 'maturity_date', issue: 'Must be later than start_date.' },
  ],
};

const RETRY_CURL = `curl -i -X GET "https://api.dzenterprise.io/v1/accounts/acc_007" \\
  -H "Authorization: Bearer {access_token}"

# HTTP/1.1 429 Too Many Requests
# Retry-After: 30`;

const RETRY_PYTHON = `import time
import requests

def call_with_retry(session, method, url, max_attempts=5, **kwargs):
    """Retry on 429 and 5xx, honouring Retry-After. Never retry 4xx otherwise."""
    for attempt in range(max_attempts):
        response = session.request(method, url, **kwargs)

        if response.status_code < 400:
            return response

        if response.status_code == 429 or response.status_code >= 500:
            wait = int(response.headers.get("Retry-After", 2 ** attempt))
            time.sleep(wait)
            continue

        # 400, 401, 403, 404, 409, 422 will not succeed on retry.
        response.raise_for_status()

    raise RuntimeError("Exhausted retries")`;

const RETRY_JS = `async function callWithRetry(url, options = {}, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(url, options);

    if (response.ok) return response;

    if (response.status === 429 || response.status >= 500) {
      const header = response.headers.get('Retry-After');
      const waitSeconds = header ? Number(header) : 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
      continue;
    }

    // 400, 401, 403, 404, 409, 422 will not succeed on retry.
    const body = await response.json();
    throw new Error(\`\${body.error}: \${body.message} (request_id \${body.request_id})\`);
  }

  throw new Error('Exhausted retries');
}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ErrorsPage() {
  return (
    <Layout
      title="Errors | DZ API"
      description="Error response format, the full error code catalogue, and retry guidance for the DZ Enterprise API."
    >
      <ApiLayout>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Getting Started</div>
          <h1 className={styles.pageTitle}>Errors</h1>
          <p className={styles.pageSubtitle}>
            Every failed request returns a standard HTTP status code and a JSON body with the
            same shape. Handle errors by switching on the{' '}
            <code style={INLINE_CODE}>error</code> field, which is stable across releases, rather
            than on the message text, which is not.
          </p>
          <div className={styles.pageAccent} />
        </div>

        {/* ── Error object ── */}
        <h2 style={H2}>The error object</h2>
        <p style={PROSE}>
          All errors share one envelope. A <code style={INLINE_CODE}>422</code> adds a{' '}
          <code style={INLINE_CODE}>details</code> array naming each field that failed validation;
          every other error omits it.
        </p>

        <FieldTable caption="Error object" fields={ERROR_FIELDS} />

        <ResponseBlock status={422} json={VALIDATION_BODY} label="422 Unprocessable Entity" />

        {/* ── Catalogue ── */}
        <h2 style={H2}>Error codes</h2>
        <p style={PROSE}>
          The codes below apply to every endpoint. Endpoint pages list only the errors specific
          to that resource.
        </p>

        <div style={{ overflowX: 'auto', margin: '14px 0 28px' }}>
          <div style={CAPTION}>Status codes and how to resolve them</div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
                {['Status', 'Error code', 'What it means', 'How to fix it'].map((h) => (
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
              {ERRORS.map((e, i) => {
                const tone = STATUS_TONE[Math.floor(e.status / 100)];
                return (
                  <tr key={e.code} style={{
                    borderBottom: i < ERRORS.length - 1 ? '1px solid #2a2a2a' : 'none',
                  }}>
                    <td style={{ padding: '13px 18px', width: '90px', verticalAlign: 'top' }}>
                      <span style={{
                        display: 'inline-block',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '4px',
                        background: tone.bg,
                        color: tone.color,
                        border: `1px solid ${tone.border}`,
                      }}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px', width: '190px', verticalAlign: 'top' }}>
                      <code style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '13px',
                        color: '#a78bfa',
                        background: '#1e1a2e',
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}>
                        {e.code}
                      </code>
                    </td>
                    <td style={{ padding: '13px 18px', color: '#e0e0e0', lineHeight: 1.5, verticalAlign: 'top' }}>
                      {e.meaning}
                    </td>
                    <td style={{ padding: '13px 18px', color: '#a0a0a0', lineHeight: 1.5, verticalAlign: 'top' }}>
                      {e.fix}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Retries ── */}
        <h2 style={H2}>Retrying safely</h2>
        <p style={PROSE}>
          Retry <code style={INLINE_CODE}>429</code> and <code style={INLINE_CODE}>5xx</code> only.
          The remaining 4xx errors describe a problem with the request itself and will fail again
          on every attempt. When a response carries a{' '}
          <code style={INLINE_CODE}>Retry-After</code> header, wait at least that many seconds;
          otherwise back off exponentially.
        </p>

        <h3 style={H3}>Retry with backoff</h3>
        <CodeTabs
          curl={RETRY_CURL}
          python={RETRY_PYTHON}
          javascript={RETRY_JS}
          label="Retry handling"
        />

        <h2 style={H2}>Reporting a problem</h2>
        <p style={PROSE}>
          Every response, successful or not, carries a{' '}
          <code style={INLINE_CODE}>request_id</code>. Include it when you contact support: it
          resolves to the exact call in our logs and turns a diagnostic conversation into a lookup.
        </p>
      </ApiLayout>
    </Layout>
  );
}

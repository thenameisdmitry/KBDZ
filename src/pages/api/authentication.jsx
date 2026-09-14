import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';
import { H2, H3, PROSE, INLINE_CODE } from '@site/src/components/ApiDocs/textStyles';

// ─── Data ────────────────────────────────────────────────────────────────────
const ENV_ROWS = [
  { env: 'Production', url: 'https://api.dzenterprise.io/v1', status: 'Live' },
  { env: 'UAT',        url: 'https://api.uat.dzenterprise.io/v1', status: 'Sandbox' },
];

const TOKEN_CURL = `curl -X POST "https://auth.dzenterprise.io/oauth/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=YOUR_CLIENT_ID" \\
  -d "client_secret=YOUR_CLIENT_SECRET" \\
  -d "scope=api:read api:write"`;

const TOKEN_PYTHON = `import requests

url = "https://auth.dzenterprise.io/oauth/token"

payload = {
    "grant_type": "client_credentials",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "scope": "api:read api:write",
}

response = requests.post(url, data=payload)
token = response.json()["access_token"]
print(token)`;

const TOKEN_RESPONSE = {
  access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  token_type: 'Bearer',
  expires_in: 3600,
  scope: 'api:read api:write',
};

const REQUEST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/accounts" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -H "X-Request-ID: req_abc123"`;

const REQUEST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
    "X-Request-ID": "req_abc123",
}

response = requests.get(f"{BASE_URL}/accounts", headers=headers)
print(response.json())`;

const TOKEN_JS = `const response = await fetch('https://auth.dzenterprise.io/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    scope: 'api:read api:write',
  }),
});

const { access_token: accessToken } = await response.json();
console.log(accessToken);`;

const REQUEST_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const response = await fetch(\`\${BASE_URL}/accounts\`, {
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    'X-Request-ID': 'req_abc123',
  },
});

console.log(await response.json());`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuthenticationPage() {
  return (
    <Layout
      title="Authentication | DZ API"
      description="Base URLs, OAuth 2.0 setup, and Bearer token usage for the API DZ Enterprise."
    >
      <ApiLayout>
        {/* ── Header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Getting Started</div>
          <h1 className={styles.pageTitle}>Base URL & Authentication</h1>
          <p className={styles.pageSubtitle}>
            The API uses the OAuth 2.0 client credentials flow. Every request must carry a short-lived
            Bearer token issued by the auth server. Tokens expire after 3600 seconds; when one expires,
            request a new token with the same client credentials.
          </p>
        
          <div className={styles.pageAccent} />
        
        </div>

        {/* ── Base URLs ── */}
        <h2 style={H2}>Base URLs</h2>
        <p style={PROSE}>
          Use the production URL for live integrations and the UAT URL for development and testing.
          Both environments expose the same API surface and use the same authentication flow.
        </p>

{/* Environment table */ }

<div 
 /*
  style={{
  border: '1px solid #6a0aaf',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '36px',
  width: '900px',
  }}
  */ 
>
  
  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
  }}>
    <thead>
      <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
        {['Environment', 'Base URL', 'Status'].map((h) => (
          <th key={h} style={{
            textAlign: 'left',
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '12px',
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
      {ENV_ROWS.map((row, i) => (
        <tr key={i} style={{
          borderBottom: i < ENV_ROWS.length - 1 ? '1px solid #2a2a2a' : 'none',
          background: 'transparent',
        }}>
          <td style={{
            padding: '14px 18px',
            fontWeight: 600,
            color: '#e0e0e0',
            fontSize: '14px',
            width: '160px',
          }}>
            {row.env}
          </td>
          <td style={{
            padding: '14px 18px',
          }}>
            <code style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              color: '#a78bfa',
              background: '#1e1a2e',
              padding: '4px 10px',
              borderRadius: '4px',
            }}>
              {row.url}
            </code>
          </td>
          <td style={{
            padding: '14px 18px',
            width: '120px',
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '99px',
              background: row.status === 'Live' ? '#052e16' : '#2a1f00',
              color: row.status === 'Live' ? '#4ade80' : '#fbbf24',
              border: `1px solid ${row.status === 'Live' ? '#166534' : '#78350f'}`,
            }}>
              {row.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* ── OAuth 2.0 flow ── */}
        <h2 style={H2}>Authentication with OAuth 2.0</h2>
        <p style={PROSE}>
          The API uses the <strong>client credentials</strong> grant type: your application authenticates
          with its own <code style={INLINE_CODE}>client_id</code> and{' '}
          <code style={INLINE_CODE}>client_secret</code>, with no user context. Tokens expire after
          <strong> 3600 seconds</strong> (1 hour). Cache the token and refresh it before it expires.
        </p>

        {/* Flow diagram (ASCII-style) */}
        <div style={{
          background: '#0d1117',
          border: '1px solid #838383',
          borderRadius: '8px',
          padding: '20px 24px',
          marginBottom: '24px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#f0f0f0',
          lineHeight: 1.7,
        }}>
          <span style={{ color: '#00d4aa' }}>Your App</span>
          {'  ──── POST /oauth/token ──────►  '}
          <span style={{ color: '#6366f1' }}>Auth Server</span>
          {'\n'}
          {'            ◄── access_token ─────────────  '}
          <span style={{ color: '#6366f1' }}>auth.api.dzenterprise.io.</span>
          {'\n\n'}
          <span style={{ color: '#00d4aa' }}>Your App</span>
          {'  ──── GET /accounts ─────────►  '}
          <span style={{ color: '#f59e0b' }}>API Server</span>
          {'\n'}
          {'         Authorization: Bearer …  '}
          <span style={{ color: '#f59e0b' }}>api.dzenterprise.io</span>
        </div>

        <h3 style={H3}>Step 1: Obtain a token</h3>
        <CodeTabs curl={TOKEN_CURL} python={TOKEN_PYTHON} javascript={TOKEN_JS} label="POST /oauth/token" />
        <ResponseBlock status={200} json={TOKEN_RESPONSE} label="200 OK" />

        <h3 style={H3}>Step 2: Authenticate requests</h3>
        <p style={PROSE}>
          Pass the token in the <code style={INLINE_CODE}>Authorization</code> header on every request.
          The <code style={INLINE_CODE}>X-Request-ID</code> header is optional but recommended: it
          correlates your logs with ours when you need to debug a call.
        </p>
        <CodeTabs curl={REQUEST_CURL} python={REQUEST_PYTHON} javascript={REQUEST_JS} label="Authenticated request" />

        {/* ── Required headers ── */}
<h2 style={H2}>Required headers</h2>

<div>
  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
  }}>
    <thead>
      <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
        {['Header', 'Value', 'Notes'].map((h) => (
          <th key={h} style={{
            textAlign: 'left',
            padding: '12px 18px',
            fontWeight: 700,
            fontSize: '12px',
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
      {[
        { header: 'Authorization', value: 'Bearer {access_token}', notes: 'Required on every endpoint' },
        { header: 'Content-Type', value: 'application/json', notes: 'Required for POST / PATCH' },
        { header: 'X-Request-ID', value: 'Unique string', notes: 'Optional. Correlates logs for debugging' },
      ].map((row, i) => (
        <tr key={i} style={{
          borderBottom: i < 2 ? '1px solid #2a2a2a' : 'none',
          background: 'transparent',
        }}>
          <td style={{
            padding: '14px 18px',
            width: '200px',
          }}>
            <code style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              color: '#a78bfa',
              background: '#1e1a2e',
              padding: '4px 10px',
              borderRadius: '4px',
            }}>
              {row.header}
            </code>
          </td>
          <td style={{
            padding: '14px 18px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            color: '#e0e0e0',
          }}>
            {row.value}
          </td>
          <td style={{
            padding: '14px 18px',
            fontSize: '14px',
            color: '#a0a0a0',
          }}>
            {row.notes}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        {/* ── Error responses ── */}
        <h2 style={H2}>Authentication errors</h2>
        <p style={PROSE}>
          A missing, malformed, or expired token returns{' '}
          <code style={INLINE_CODE}>401 unauthorized</code>. A valid token without the required
          scope returns <code style={INLINE_CODE}>403 insufficient_scope</code>. Both follow the
          shared error envelope described in{' '}
          <Link to="/api/errors" style={{ color: '#a78bfa' }}>Errors</Link>.
        </p>
        <ResponseBlock
          status={401}
          json={{
            error: 'unauthorized',
            message: 'Bearer token is missing or has expired.',
            status: 401,
            request_id: 'req_abc123',
          }}
          label="401 Unauthorized"
        />
      </ApiLayout>
    </Layout>
  );
}

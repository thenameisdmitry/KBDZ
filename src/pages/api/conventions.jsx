import React from 'react';
import Layout from '@theme/Layout';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import FieldTable from '@site/src/components/ApiDocs/FieldTable';
import ParamTable from '@site/src/components/ApiDocs/ParamTable';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';
import { H2, H3, PROSE, INLINE_CODE, CAPTION } from '@site/src/components/ApiDocs/textStyles';

// ─── Data ─────────────────────────────────────────────────────────────────────
const PAGE_PARAMS = [
  { name: 'limit', type: 'integer', required: false, description: 'Results per page. Default: 20. Maximum: 100.' },
  { name: 'offset', type: 'integer', required: false, description: 'Results to skip before the page starts. Default: 0.' },
];

const ENVELOPE_FIELDS = [
  { name: 'data', type: 'array', description: 'The page of results. Empty when nothing matches the filter; never null.' },
  { name: 'total', type: 'integer', description: 'Total number of records matching the filter, across all pages.' },
  { name: 'limit', type: 'integer', description: 'The limit applied to this response, after clamping to the maximum.' },
  { name: 'offset', type: 'integer', description: 'The offset applied to this response.' },
];

const SORT_PARAMS = [
  { name: 'sort', type: 'string', required: false, description: 'Field to sort by. Prefix with a hyphen for descending order, for example -created_at.' },
  { name: 'created_after', type: 'string', required: false, description: 'RFC 3339 timestamp. Returns records created strictly after this instant.' },
  { name: 'created_before', type: 'string', required: false, description: 'RFC 3339 timestamp. Returns records created strictly before this instant.' },
];

const RATE_HEADERS = [
  { name: 'X-RateLimit-Limit', type: 'integer', description: 'Requests permitted in the current window.' },
  { name: 'X-RateLimit-Remaining', type: 'integer', description: 'Requests still available in the current window.' },
  { name: 'X-RateLimit-Reset', type: 'integer', description: 'Unix timestamp at which the window resets.' },
  { name: 'Retry-After', type: 'integer', description: 'Sent with 429 only. Seconds to wait before retrying.' },
];

const FORMATS = [
  { name: 'Timestamps', type: 'string', description: 'RFC 3339 in UTC, for example 2026-03-15T10:30:00Z. Fields ending in _at are timestamps.' },
  { name: 'Dates', type: 'string', description: 'ISO 8601 calendar dates without a time component, for example 2026-01-15. Fields ending in _date are dates.' },
  { name: 'Money', type: 'number', description: 'Decimal in the major unit of the currency, for example 12500000.00 for GBP. Always paired with a currency field.' },
  { name: 'Currency', type: 'string', description: 'ISO 4217 three-letter code in upper case, for example GBP.' },
  { name: 'Identifiers', type: 'string', description: 'Opaque, prefixed strings such as acc_007 or prt_BNPParibas_001. Treat them as opaque and never parse them.' },
  { name: 'Enumerations', type: 'string', description: 'Lower case with underscores, for example money_market. New values may be added in a minor release.' },
];

const PAGE_CURL = `curl -X GET "https://api.dzenterprise.io/v1/accounts?limit=50&offset=100&sort=-created_at" \\
  -H "Authorization: Bearer {access_token}"`;

const PAGE_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"
headers = {"Authorization": "Bearer {access_token}"}

def iter_accounts(page_size=100):
    """Walk every page until the envelope says we have seen them all."""
    offset = 0
    while True:
        response = requests.get(
            f"{BASE_URL}/accounts",
            params={"limit": page_size, "offset": offset},
            headers=headers,
        )
        payload = response.json()
        yield from payload["data"]

        offset += page_size
        if offset >= payload["total"]:
            break`;

const PAGE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const headers = { Authorization: \`Bearer \${accessToken}\` };

async function* iterAccounts(pageSize = 100) {
  let offset = 0;

  while (true) {
    const query = new URLSearchParams({ limit: pageSize, offset });
    const response = await fetch(\`\${BASE_URL}/accounts?\${query}\`, { headers });
    const payload = await response.json();

    yield* payload.data;

    offset += pageSize;
    if (offset >= payload.total) break;
  }
}`;

const IDEMPOTENCY_CURL = `curl -X POST "https://api.dzenterprise.io/v1/transactions" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 5f2b8c14-9d7a-4e31-b6c0-1a2f3e4d5c6b" \\
  -d '{
    "account_id": "acc_007",
    "type": "wire",
    "amount": 5000.00,
    "currency": "USD"
  }'`;

const IDEMPOTENCY_PYTHON = `import uuid
import requests

BASE_URL = "https://api.dzenterprise.io/v1"

# Generate the key once, then reuse it for every retry of this same payment.
idempotency_key = str(uuid.uuid4())

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
    "Idempotency-Key": idempotency_key,
}

payload = {
    "account_id": "acc_007",
    "type": "wire",
    "amount": 5000.00,
    "currency": "USD",
}

response = requests.post(f"{BASE_URL}/transactions", json=payload, headers=headers)
print(response.json())`;

const IDEMPOTENCY_JS = `// Generate the key once, then reuse it for every retry of this same payment.
const idempotencyKey = crypto.randomUUID();

const response = await fetch('https://api.dzenterprise.io/v1/transactions', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  },
  body: JSON.stringify({
    account_id: 'acc_007',
    type: 'wire',
    amount: 5000.0,
    currency: 'USD',
  }),
});

console.log(await response.json());`;

const LIST_ENVELOPE = {
  data: ['…'],
  total: 137,
  limit: 20,
  offset: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ConventionsPage() {
  return (
    <Layout
      title="Conventions | DZ API"
      description="Pagination, filtering, sorting, rate limits, idempotency, versioning, and data formats for the DZ Enterprise API."
    >
      <ApiLayout>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Getting Started</div>
          <h1 className={styles.pageTitle}>Conventions</h1>
          <p className={styles.pageSubtitle}>
            Rules that hold across every endpoint: how collections are paged, filtered, and sorted;
            how rate limits and retries behave; how to make writes safe to repeat; and how the API
            versions and deprecates itself. Read this once and the endpoint pages become reference
            material rather than instructions.
          </p>
          <div className={styles.pageAccent} />
        </div>

        {/* ── Pagination ── */}
        <h2 style={H2}>Pagination</h2>
        <p style={PROSE}>
          Every collection endpoint returns the same envelope and accepts the same two parameters.
          A <code style={INLINE_CODE}>limit</code> above 100 is clamped to 100 rather than
          rejected, so always read the <code style={INLINE_CODE}>limit</code> the response reports
          back rather than the one you sent.
        </p>

        <ParamTable caption="Pagination parameters" params={PAGE_PARAMS} />
        <FieldTable caption="List envelope" fields={ENVELOPE_FIELDS} />
        <ResponseBlock status={200} json={LIST_ENVELOPE} />

        <h3 style={H3}>Walking every page</h3>
        <p style={PROSE}>
          Stop when <code style={INLINE_CODE}>offset</code> reaches{' '}
          <code style={INLINE_CODE}>total</code>. Do not stop on a short page: a filter applied
          after paging can legitimately return fewer rows than the limit while more pages remain.
        </p>
        <CodeTabs
          curl={PAGE_CURL}
          python={PAGE_PYTHON}
          javascript={PAGE_JS}
          label="Pagination"
        />

        {/* ── Filtering and sorting ── */}
        <h2 style={H2}>Filtering and sorting</h2>
        <p style={PROSE}>
          Each endpoint documents its own filters, such as{' '}
          <code style={INLINE_CODE}>status</code> on Accounts or{' '}
          <code style={INLINE_CODE}>account_id</code> on Transactions. Multiple filters combine
          with AND. The parameters below work on every collection.
        </p>
        <ParamTable caption="Common query parameters" params={SORT_PARAMS} />
        <p style={PROSE}>
          Results are sorted by <code style={INLINE_CODE}>-created_at</code> unless you say
          otherwise, so the newest record comes first. Sorting is applied before paging.
        </p>

        {/* ── Rate limits ── */}
        <h2 style={H2}>Rate limits</h2>
        <p style={PROSE}>
          Requests are limited per client, per environment: <strong>600 requests per minute</strong>{' '}
          on production and <strong>120 requests per minute</strong> on UAT. Exceeding the limit
          returns <code style={INLINE_CODE}>429 rate_limit_exceeded</code>. Every response carries
          your current budget, so you can throttle before you are throttled.
        </p>
        <FieldTable caption="Rate limit headers" fields={RATE_HEADERS} />
        <p style={PROSE}>
          See <a href="/api/errors" style={{ color: '#a78bfa' }}>Errors</a> for the retry pattern
          that honours <code style={INLINE_CODE}>Retry-After</code>.
        </p>

        {/* ── Idempotency ── */}
        <h2 style={H2}>Idempotency</h2>
        <p style={PROSE}>
          <code style={INLINE_CODE}>GET</code>, <code style={INLINE_CODE}>PATCH</code>, and{' '}
          <code style={INLINE_CODE}>DELETE</code> are idempotent by definition: repeating them
          leaves the resource in the same state. <code style={INLINE_CODE}>POST</code> is not, and
          a timeout leaves you unable to tell whether the resource was created.
        </p>
        <p style={PROSE}>
          Send an <code style={INLINE_CODE}>Idempotency-Key</code> header with every{' '}
          <code style={INLINE_CODE}>POST</code>. Generate a UUID per logical operation, not per
          HTTP attempt, and reuse it on retries. The first request with a given key is processed;
          any later request with the same key returns the original response instead of creating a
          second resource. Keys are retained for 24 hours.
        </p>
        <CodeTabs
          curl={IDEMPOTENCY_CURL}
          python={IDEMPOTENCY_PYTHON}
          javascript={IDEMPOTENCY_JS}
          label="POST /transactions"
        />

        {/* ── Versioning ── */}
        <h2 style={H2}>Versioning and deprecation</h2>
        <p style={PROSE}>
          The major version is part of the path: <code style={INLINE_CODE}>/v1</code>. It changes
          only for a breaking change, and two major versions run in parallel for at least twelve
          months.
        </p>
        <p style={PROSE}>
          The following are <strong>not</strong> breaking changes, and your client must tolerate
          them without a release:
        </p>
        <ul style={{ ...PROSE, paddingLeft: '22px' }}>
          <li>A new field added to a response object.</li>
          <li>A new optional request parameter.</li>
          <li>A new value added to an existing enumeration.</li>
          <li>A new endpoint or a new error code.</li>
        </ul>
        <p style={PROSE}>
          When an endpoint is deprecated, its responses carry a{' '}
          <code style={INLINE_CODE}>Deprecation</code> header with the date it was announced and a{' '}
          <code style={INLINE_CODE}>Sunset</code> header with the date it stops responding. Both
          are announced in the changelog before the header appears.
        </p>

        {/* ── Data formats ── */}
        <h2 style={H2}>Data formats</h2>
        <p style={PROSE}>
          The API accepts and returns <code style={INLINE_CODE}>application/json</code> only, and
          field names are lower case with underscores.
        </p>
        <FieldTable caption="Formats used across the API" fields={FORMATS} />

        <h3 style={H3}>Null and absent</h3>
        <p style={PROSE}>
          A <code style={INLINE_CODE}>null</code> field is present and deliberately empty. An
          absent field was not returned at all, usually because your token lacks the scope to see
          it. On <code style={INLINE_CODE}>PATCH</code>, sending{' '}
          <code style={INLINE_CODE}>null</code> clears a value, whereas omitting the field leaves
          it untouched.
        </p>

        <div style={CAPTION}>Related</div>
        <p style={PROSE}>
          <a href="/api/authentication" style={{ color: '#a78bfa' }}>Base URL &amp; Authentication</a>
          {' · '}
          <a href="/api/errors" style={{ color: '#a78bfa' }}>Errors</a>
        </p>
      </ApiLayout>
    </Layout>
  );
}

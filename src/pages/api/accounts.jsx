import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import EndpointSection from '@site/src/components/ApiDocs/EndpointSection';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import ParamTable from '@site/src/components/ApiDocs/ParamTable';
import FieldTable from '@site/src/components/ApiDocs/FieldTable';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';
import { PROSE, INLINE_CODE } from '@site/src/components/ApiDocs/textStyles';

// ─── Shared sample data ───────────────────────────────────────────────────────
const ACCOUNT = {
  id: 'acc_007',
  owner_id: 'james_b',
  name: 'BHMS Account 007',
  type: 'fee',
  currency: 'GBP',
  balance: 12500000.00,
  status: 'active',
  created_at: '2026-03-15T10:30:00Z',
  updated_at: '2026-03-20T14:22:00Z',
};

const ACCOUNT_LIST = {
  data: [
    ACCOUNT,
    {
      ...ACCOUNT,
      id: 'acc_006',
      owner_id: 'alec_t',
      name: 'Operating Account',
      type: 'operating',
      balance: 42000000.00,
    },
  ],
  total: 2,
  limit: 20,
  offset: 0,
};

// Account types accepted by the API. Referenced from the parameter tables so the
// enum and the examples cannot drift apart.
const ACCOUNT_TYPES = 'trading, operating, custody, fee';
const ACCOUNT_STATUSES = 'active, suspended, closed';

const ACCOUNT_FIELDS = [
  { name: 'id', type: 'string', description: 'Unique Account identifier. Opaque, do not parse it.' },
  { name: 'owner_id', type: 'string', description: 'Identifier of the user who owns this Account.' },
  { name: 'name', type: 'string', description: 'Human-readable label shown in the UI.' },
  { name: 'type', type: 'string', description: `Purpose the Account serves. One of: ${ACCOUNT_TYPES}. Fixed at creation.` },
  { name: 'currency', type: 'string', description: 'ISO 4217 code. Fixed at creation.' },
  { name: 'balance', type: 'number', description: 'Current balance in the major unit of currency.' },
  { name: 'status', type: 'string', description: `One of: ${ACCOUNT_STATUSES}.` },
  { name: 'created_at', type: 'string', description: 'RFC 3339 timestamp in UTC.' },
  { name: 'updated_at', type: 'string', description: 'RFC 3339 timestamp in UTC of the last change.' },
];

const LIST_FIELDS = [
  { name: 'data', type: 'array', description: 'The page of Account objects. Empty when nothing matches, never null.' },
  { name: 'total', type: 'integer', description: 'Total Accounts matching the filter, across all pages.' },
  { name: 'limit', type: 'integer', description: 'The limit applied to this response, after clamping to 100.' },
  { name: 'offset', type: 'integer', description: 'The offset applied to this response.' },
];

// ─── Snippets ─────────────────────────────────────────────────────────────────
const LIST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/accounts?limit=20&offset=0&status=active" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json"`;

const LIST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

params  = {"limit": 20, "offset": 0, "status": "active"}
headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/accounts", params=params, headers=headers)
data = response.json()
print(data["data"])`;

const LIST_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const query = new URLSearchParams({ limit: 20, offset: 0, status: 'active' });

const response = await fetch(\`\${BASE_URL}/accounts?\${query}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

const { data } = await response.json();
console.log(data);`;

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/accounts/acc_007" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"
ACCOUNT_ID = "acc_007"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/accounts/{ACCOUNT_ID}", headers=headers)
print(response.json())`;

const GET_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const accountId = 'acc_007';

const response = await fetch(\`\${BASE_URL}/accounts/\${accountId}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(await response.json());`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/accounts" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 5f2b8c14-9d7a-4e31-b6c0-1a2f3e4d5c6b" \\
  -d '{
    "owner_id": "james_b",
    "name": "Main Trading Account",
    "type": "trading",
    "currency": "USD"
  }'`;

const CREATE_PYTHON = `import uuid
import requests

BASE_URL = "https://api.dzenterprise.io/v1"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
    "Idempotency-Key": str(uuid.uuid4()),
}

payload = {
    "owner_id": "james_b",
    "name": "Main Trading Account",
    "type": "trading",
    "currency": "USD",
}

response = requests.post(f"{BASE_URL}/accounts", json=payload, headers=headers)
print(response.json())`;

const CREATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const response = await fetch(\`\${BASE_URL}/accounts\`, {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    owner_id: 'james_b',
    name: 'Main Trading Account',
    type: 'trading',
    currency: 'USD',
  }),
});

console.log(await response.json());`;

const UPDATE_CURL = `curl -X PATCH "https://api.dzenterprise.io/v1/accounts/acc_007" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Primary Custodian Account", "status": "active"}'`;

const UPDATE_PYTHON = `import requests

BASE_URL   = "https://api.dzenterprise.io/v1"
ACCOUNT_ID = "acc_007"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {"name": "Primary Custodian Account", "status": "active"}

response = requests.patch(
    f"{BASE_URL}/accounts/{ACCOUNT_ID}", json=payload, headers=headers
)
print(response.json())`;

const UPDATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const accountId = 'acc_007';

const response = await fetch(\`\${BASE_URL}/accounts/\${accountId}\`, {
  method: 'PATCH',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Primary Custodian Account', status: 'active' }),
});

console.log(await response.json());`;

const DELETE_CURL = `curl -X DELETE "https://api.dzenterprise.io/v1/accounts/acc_007" \\
  -H "Authorization: Bearer {access_token}"`;

const DELETE_PYTHON = `import requests

BASE_URL   = "https://api.dzenterprise.io/v1"
ACCOUNT_ID = "acc_007"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.delete(f"{BASE_URL}/accounts/{ACCOUNT_ID}", headers=headers)
print(response.status_code)  # 204`;

const DELETE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const accountId = 'acc_007';

const response = await fetch(\`\${BASE_URL}/accounts/\${accountId}\`, {
  method: 'DELETE',
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(response.status); // 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AccountsPage() {
  return (
    <Layout title="Accounts | DZ API" description="CRUD endpoints for managing DZ Custodian Accounts.">
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Reference Data</div>
          <h1 className={styles.pageTitle}>Accounts</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Create and manage Accounts in your environment. The API supports full CRUD operations.
          </p>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            For Account management, Account parameters, and reference data in the DZ environment,
            see the <Link to="/docs/stub" style={{ color: '#a78bfa' }}>Reference Data User Guide</Link>.
            Pagination, filtering, and idempotency work the same way here as everywhere else: see{' '}
            <Link to="/api/conventions" style={{ color: '#a78bfa' }}>Conventions</Link> and{' '}
            <Link to="/api/errors" style={{ color: '#a78bfa' }}>Errors</Link>.
          </p>

          <div className={styles.pageAccent} />
        </div>

        {/* ── GET /accounts ── */}
        <EndpointSection
          id="list-accounts"
          method="GET"
          path="/accounts"
          title="List accounts"
          description="Returns a paginated list of Accounts. Filter by status to narrow results."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'limit', type: 'integer', required: false, description: 'Results per page. Default: 20. Maximum: 100.' },
              { name: 'offset', type: 'integer', required: false, description: 'Results to skip before the page starts. Default: 0.' },
              { name: 'status', type: 'string', required: false, description: `Filter by Account status. One of: ${ACCOUNT_STATUSES}.` },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} javascript={LIST_JS} />
          <FieldTable caption="Response fields" fields={LIST_FIELDS} />
          <ResponseBlock status={200} json={ACCOUNT_LIST} />
        </EndpointSection>

        {/* ── GET /accounts/:id ── */}
        <EndpointSection
          id="get-account"
          method="GET"
          path="/accounts/{id}"
          title="Get account by ID"
          description="Retrieves the full details of a single Account by its unique identifier."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Account ID, for example acc_007.' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} javascript={GET_JS} />
          <FieldTable caption="Response fields: Account object" fields={ACCOUNT_FIELDS} />
          <ResponseBlock status={200} json={ACCOUNT} />
        </EndpointSection>

        {/* ── POST /accounts ── */}
        <EndpointSection
          id="create-account"
          method="POST"
          path="/accounts"
          title="Create account"
          description="Creates an Account for the specified owner and returns the created resource."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'owner_id', type: 'string', required: true, description: 'ID of the user who owns this Account.' },
              { name: 'name', type: 'string', required: true, description: 'Human-readable label for the Account.' },
              { name: 'type', type: 'string', required: true, description: `Account type. One of: ${ACCOUNT_TYPES}. Cannot be changed later.` },
              { name: 'currency', type: 'string', required: true, description: 'ISO 4217 currency code, for example USD, EUR, GBP. Cannot be changed later.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            Send an <code style={INLINE_CODE}>Idempotency-Key</code> header so a retry after a
            timeout returns the original Account instead of creating a second one.
          </p>
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} javascript={CREATE_JS} />
          <FieldTable caption="Response fields: Account object" fields={ACCOUNT_FIELDS} />
          <ResponseBlock status={201} json={ACCOUNT} />
        </EndpointSection>

        {/* ── PATCH /accounts/:id ── */}
        <EndpointSection
          id="update-account"
          method="PATCH"
          path="/accounts/{id}"
          title="Update account"
          description="Partially updates an Account. Only the fields you send are modified."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Account ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'name', type: 'string', required: false, description: 'New display name for the Account.' },
              { name: 'status', type: 'string', required: false, description: `New status. One of: ${ACCOUNT_STATUSES}.` },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            <code style={INLINE_CODE}>type</code> and <code style={INLINE_CODE}>currency</code> are
            fixed at creation. Sending either returns{' '}
            <code style={INLINE_CODE}>422 validation_failed</code>.
          </p>
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} javascript={UPDATE_JS} />
          <FieldTable caption="Response fields: Account object" fields={ACCOUNT_FIELDS} />
          <ResponseBlock
            status={200}
            json={{ ...ACCOUNT, name: 'Primary Custodian Account', updated_at: '2026-04-01T09:00:00Z' }}
          />
        </EndpointSection>

        {/* ── DELETE /accounts/:id ── */}
        <EndpointSection
          id="remove-account"
          method="DELETE"
          path="/accounts/{id}"
          title="Remove account"
          description="Permanently deletes an Account and all its associated data. This action cannot be undone."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Account ID to delete.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            An Account that still holds an open Position returns{' '}
            <code style={INLINE_CODE}>409 conflict</code>. Close the Position first, then retry.
          </p>
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} javascript={DELETE_JS} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>
      </ApiLayout>
    </Layout>
  );
}

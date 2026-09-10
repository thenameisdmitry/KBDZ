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

// Custodian vocabulary, declared once so the prose, the parameter tables and
// the samples cannot drift apart.
const INSTITUTION_TYPES = 'custodian_bank, prime_broker, clearing_house, commercial_bank, fund_administrator';
const CUSTODIAN_STATUSES = 'active, suspended, inactive';

// ─── Shared sample data ───────────────────────────────────────────────────────
const CUSTODIAN = {
  id: 'cus_BNP_001',
  name: 'BNP Paribas Securities Services',
  code: 'BNPPSS',
  institution_type: 'custodian_bank',
  bic: 'PARBFRPP',
  country: 'FR',
  contact_email: 'custody.ops@example-bnp.com',
  status: 'active',
  created_at: '2026-01-08T09:15:00Z',
  updated_at: '2026-03-18T13:40:00Z',
};

const CUSTODIAN_LIST = {
  data: [
    CUSTODIAN,
    {
      ...CUSTODIAN,
      id: 'cus_JPM_002',
      name: 'J.P. Morgan Prime Brokerage',
      code: 'JPMPB',
      institution_type: 'prime_broker',
      bic: 'CHASGB2L',
      country: 'GB',
      contact_email: 'pb.support@example-jpm.com',
    },
  ],
  total: 2,
  limit: 20,
  offset: 0,
};

const CUSTODIAN_FIELDS = [
  { name: 'id', type: 'string', description: 'Unique Custodian identifier. Opaque, do not parse it.' },
  { name: 'name', type: 'string', description: 'Full legal name of the institution.' },
  { name: 'code', type: 'string', description: 'Short internal code, upper case, unique across the environment. Used on statements and feed files.' },
  { name: 'institution_type', type: 'string', description: `Kind of institution. One of: ${INSTITUTION_TYPES}.` },
  { name: 'bic', type: 'string', description: 'SWIFT BIC, 8 or 11 characters. Null when the institution has none.' },
  { name: 'country', type: 'string', description: 'ISO 3166-1 alpha-2 country code of the registered entity.' },
  { name: 'contact_email', type: 'string', description: 'Operations mailbox used for reconciliation queries.' },
  { name: 'status', type: 'string', description: `One of: ${CUSTODIAN_STATUSES}. Only active Custodians accept new Accounts.` },
  { name: 'created_at', type: 'string', description: 'RFC 3339 timestamp in UTC.' },
  { name: 'updated_at', type: 'string', description: 'RFC 3339 timestamp in UTC of the last change.' },
];

const LIST_FIELDS = [
  { name: 'data', type: 'array', description: 'The page of Custodian objects. Empty when nothing matches, never null.' },
  { name: 'total', type: 'integer', description: 'Total Custodians matching the filter, across all pages.' },
  { name: 'limit', type: 'integer', description: 'The limit applied to this response, after clamping to 100.' },
  { name: 'offset', type: 'integer', description: 'The offset applied to this response.' },
];

// ─── Snippets ─────────────────────────────────────────────────────────────────
const LIST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/custodians?institution_type=custodian_bank&limit=20" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json"`;

const LIST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

params  = {"institution_type": "custodian_bank", "limit": 20}
headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/custodians", params=params, headers=headers)
print(response.json()["data"])`;

const LIST_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const query = new URLSearchParams({ institution_type: 'custodian_bank', limit: 20 });

const response = await fetch(\`\${BASE_URL}/custodians?\${query}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

const { data } = await response.json();
console.log(data);`;

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/custodians/cus_BNP_001" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL     = "https://api.dzenterprise.io/v1"
CUSTODIAN_ID = "cus_BNP_001"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/custodians/{CUSTODIAN_ID}", headers=headers)
print(response.json())`;

const GET_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const custodianId = 'cus_BNP_001';

const response = await fetch(\`\${BASE_URL}/custodians/\${custodianId}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(await response.json());`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/custodians" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: b91f0d47-2c6e-4a35-8f71-0e4c9a3b6d28" \\
  -d '{
    "name": "BNP Paribas Securities Services",
    "code": "BNPPSS",
    "institution_type": "custodian_bank",
    "bic": "PARBFRPP",
    "country": "FR",
    "contact_email": "custody.ops@example-bnp.com"
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
    "name":             "BNP Paribas Securities Services",
    "code":             "BNPPSS",
    "institution_type": "custodian_bank",
    "bic":              "PARBFRPP",
    "country":          "FR",
    "contact_email":    "custody.ops@example-bnp.com",
}

response = requests.post(f"{BASE_URL}/custodians", json=payload, headers=headers)
print(response.json())`;

const CREATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const response = await fetch(\`\${BASE_URL}/custodians\`, {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    name: 'BNP Paribas Securities Services',
    code: 'BNPPSS',
    institution_type: 'custodian_bank',
    bic: 'PARBFRPP',
    country: 'FR',
    contact_email: 'custody.ops@example-bnp.com',
  }),
});

console.log(await response.json());`;

const UPDATE_CURL = `curl -X PATCH "https://api.dzenterprise.io/v1/custodians/cus_BNP_001" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"contact_email": "custody.emea@example-bnp.com", "status": "active"}'`;

const UPDATE_PYTHON = `import requests

BASE_URL     = "https://api.dzenterprise.io/v1"
CUSTODIAN_ID = "cus_BNP_001"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "contact_email": "custody.emea@example-bnp.com",
    "status":        "active",
}

response = requests.patch(
    f"{BASE_URL}/custodians/{CUSTODIAN_ID}", json=payload, headers=headers
)
print(response.json())`;

const UPDATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const custodianId = 'cus_BNP_001';

const response = await fetch(\`\${BASE_URL}/custodians/\${custodianId}\`, {
  method: 'PATCH',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contact_email: 'custody.emea@example-bnp.com',
    status: 'active',
  }),
});

console.log(await response.json());`;

const DELETE_CURL = `curl -X DELETE "https://api.dzenterprise.io/v1/custodians/cus_BNP_001" \\
  -H "Authorization: Bearer {access_token}"`;

const DELETE_PYTHON = `import requests

BASE_URL     = "https://api.dzenterprise.io/v1"
CUSTODIAN_ID = "cus_BNP_001"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.delete(f"{BASE_URL}/custodians/{CUSTODIAN_ID}", headers=headers)
print(response.status_code)  # 204`;

const DELETE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const custodianId = 'cus_BNP_001';

const response = await fetch(\`\${BASE_URL}/custodians/\${custodianId}\`, {
  method: 'DELETE',
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(response.status); // 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustodiansPage() {
  return (
    <Layout
      title="Custodians | DZ API"
      description="CRUD endpoints for managing Custodians: banks, prime brokers, and clearing houses holding your assets."
    >
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Reference Data</div>
          <h1 className={styles.pageTitle}>Custodians</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Create and manage Custodians in your environment. The API supports full CRUD operations.
          </p>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            A Custodian is the institution that holds your assets: a custodian bank, a prime
            broker, a clearing house, a commercial bank, or a fund administrator. Every{' '}
            <Link to="/api/accounts" style={{ color: '#a78bfa' }}>Account</Link> is opened at a
            Custodian, and Custodian records supply the routing details that{' '}
            <Link to="/api/payments" style={{ color: '#a78bfa' }}>Payments</Link> settle through.
            Pagination, filtering, and idempotency follow the shared{' '}
            <Link to="/api/conventions" style={{ color: '#a78bfa' }}>Conventions</Link>.
          </p>

          <div className={styles.pageAccent} />
        </div>

        {/* ── GET /custodians ── */}
        <EndpointSection
          id="list-custodians"
          method="GET"
          path="/custodians"
          title="List custodians"
          description="Returns a paginated list of Custodians. Filter by institution type, country, or status to narrow results."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'institution_type', type: 'string', required: false, description: `Filter by institution type. One of: ${INSTITUTION_TYPES}.` },
              { name: 'country', type: 'string', required: false, description: 'Filter by ISO 3166-1 alpha-2 country code, for example FR.' },
              { name: 'status', type: 'string', required: false, description: `Filter by status. One of: ${CUSTODIAN_STATUSES}.` },
              { name: 'limit', type: 'integer', required: false, description: 'Results per page. Default: 20. Maximum: 100.' },
              { name: 'offset', type: 'integer', required: false, description: 'Results to skip before the page starts. Default: 0.' },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} javascript={LIST_JS} />
          <FieldTable caption="Response fields" fields={LIST_FIELDS} />
          <ResponseBlock status={200} json={CUSTODIAN_LIST} />
        </EndpointSection>

        {/* ── GET /custodians/:id ── */}
        <EndpointSection
          id="get-custodian"
          method="GET"
          path="/custodians/{id}"
          title="Get custodian by ID"
          description="Retrieves the full details of a single Custodian by its unique identifier."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Custodian ID, for example cus_BNP_001.' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} javascript={GET_JS} />
          <FieldTable caption="Response fields — Custodian object" fields={CUSTODIAN_FIELDS} />
          <ResponseBlock status={200} json={CUSTODIAN} />
        </EndpointSection>

        {/* ── POST /custodians ── */}
        <EndpointSection
          id="create-custodian"
          method="POST"
          path="/custodians"
          title="Create custodian"
          description="Registers a Custodian in your environment and returns the created resource."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'name', type: 'string', required: true, description: 'Full legal name of the institution.' },
              { name: 'code', type: 'string', required: true, description: 'Short internal code, upper case. Must be unique across the environment.' },
              { name: 'institution_type', type: 'string', required: true, description: `Kind of institution. One of: ${INSTITUTION_TYPES}.` },
              { name: 'bic', type: 'string', required: false, description: 'SWIFT BIC, 8 or 11 characters. Required before the Custodian can settle SWIFT Payments.' },
              { name: 'country', type: 'string', required: true, description: 'ISO 3166-1 alpha-2 country code of the registered entity.' },
              { name: 'contact_email', type: 'string', required: false, description: 'Operations mailbox used for reconciliation queries.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            A new Custodian starts with <code style={INLINE_CODE}>status: active</code>. Reusing an
            existing <code style={INLINE_CODE}>code</code> returns{' '}
            <code style={INLINE_CODE}>409 conflict</code>.
          </p>
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} javascript={CREATE_JS} />
          <FieldTable caption="Response fields — Custodian object" fields={CUSTODIAN_FIELDS} />
          <ResponseBlock status={201} json={CUSTODIAN} />
        </EndpointSection>

        {/* ── PATCH /custodians/:id ── */}
        <EndpointSection
          id="update-custodian"
          method="PATCH"
          path="/custodians/{id}"
          title="Update custodian"
          description="Partially updates a Custodian. Only the fields you send are modified."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Custodian ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'name', type: 'string', required: false, description: 'Updated legal name of the institution.' },
              { name: 'bic', type: 'string', required: false, description: 'Updated SWIFT BIC.' },
              { name: 'contact_email', type: 'string', required: false, description: 'Updated operations mailbox. Send null to clear it.' },
              { name: 'status', type: 'string', required: false, description: `New status. One of: ${CUSTODIAN_STATUSES}.` },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            <code style={INLINE_CODE}>code</code>, <code style={INLINE_CODE}>institution_type</code>,
            and <code style={INLINE_CODE}>country</code> are fixed at creation, because downstream
            feed files and settlement instructions are keyed on them. Sending any of them returns{' '}
            <code style={INLINE_CODE}>422 validation_failed</code>. Setting a Custodian to{' '}
            <code style={INLINE_CODE}>suspended</code> blocks new Accounts and Payments but leaves
            existing ones untouched.
          </p>
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} javascript={UPDATE_JS} />
          <FieldTable caption="Response fields — Custodian object" fields={CUSTODIAN_FIELDS} />
          <ResponseBlock
            status={200}
            json={{
              ...CUSTODIAN,
              contact_email: 'custody.emea@example-bnp.com',
              updated_at: '2026-04-02T11:05:00Z',
            }}
          />
        </EndpointSection>

        {/* ── DELETE /custodians/:id ── */}
        <EndpointSection
          id="remove-custodian"
          method="DELETE"
          path="/custodians/{id}"
          title="Remove custodian"
          description="Permanently deletes a Custodian. This action cannot be undone."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Custodian ID to delete.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            A Custodian that still has Accounts or unsettled Payments returns{' '}
            <code style={INLINE_CODE}>409 conflict</code>. To retire an institution while keeping
            its history, set <code style={INLINE_CODE}>status</code> to{' '}
            <code style={INLINE_CODE}>inactive</code> instead of deleting it.
          </p>
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} javascript={DELETE_JS} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>
      </ApiLayout>
    </Layout>
  );
}

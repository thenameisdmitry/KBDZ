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
const AGREEMENT = {
  id: 'agr_BNP_001',
  account_id: 'acc_007',
  type: 'credit',
  name: 'BHMS / BNP Paribas Credit Agreement',
  principal_amount: 50000000.00,
  currency: 'GBP',
  interest_rate: 4.25,
  start_date: '2026-01-15',
  maturity_date: '2031-01-15',
  status: 'active',
  created_at: '2026-01-10T09:00:00Z',
  updated_at: '2026-03-20T14:22:00Z',
};

const AGREEMENT_LIST = {
  data: [
    AGREEMENT,
    {
      ...AGREEMENT,
      id: 'agr_JPM_002',
      account_id: 'acc_006',
      name: 'BHMS / JP Morgan Credit Agreement',
      principal_amount: 75000000.00,
      interest_rate: 4.10,
      start_date: '2025-06-01',
      maturity_date: '2030-06-01',
    },
  ],
  total: 2,
  limit: 20,
  offset: 0,
};

const AGREEMENT_TYPES = 'credit';
const AGREEMENT_STATUSES = 'pending, active, terminated';

const AGREEMENT_FIELDS = [
  { name: 'id', type: 'string', description: 'Unique Credit Agreement identifier. Opaque, do not parse it.' },
  { name: 'account_id', type: 'string', description: 'Account this Agreement is scoped to. Fixed at creation.' },
  { name: 'type', type: 'string', description: `Agreement type. One of: ${AGREEMENT_TYPES}. Fixed at creation.` },
  { name: 'name', type: 'string', description: 'Descriptive name shown in the UI and on statements.' },
  { name: 'principal_amount', type: 'number', description: 'Facility principal in the major unit of currency.' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code. Fixed at creation.' },
  { name: 'interest_rate', type: 'number', description: 'Annual interest rate as a percentage, for example 4.25.' },
  { name: 'start_date', type: 'string', description: 'ISO 8601 date on which the facility becomes available.' },
  { name: 'maturity_date', type: 'string', description: 'ISO 8601 date on which the facility matures. Always later than start_date.' },
  { name: 'status', type: 'string', description: `One of: ${AGREEMENT_STATUSES}.` },
  { name: 'created_at', type: 'string', description: 'RFC 3339 timestamp in UTC.' },
  { name: 'updated_at', type: 'string', description: 'RFC 3339 timestamp in UTC of the last change.' },
];

const LIST_FIELDS = [
  { name: 'data', type: 'array', description: 'The page of Credit Agreement objects. Empty when nothing matches, never null.' },
  { name: 'total', type: 'integer', description: 'Total Agreements matching the filter, across all pages.' },
  { name: 'limit', type: 'integer', description: 'The limit applied to this response, after clamping to 100.' },
  { name: 'offset', type: 'integer', description: 'The offset applied to this response.' },
];

// ─── cURL / Python / JavaScript snippets ─────────────────────────────────────
const LIST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/agreements?limit=20&offset=0&status=active" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json"`;

const LIST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

params  = {"limit": 20, "offset": 0, "status": "active"}
headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/agreements", params=params, headers=headers)
data = response.json()
print(data["data"])`;

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/agreements/agr_BNP_001" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL      = "https://api.dzenterprise.io/v1"
AGREEMENT_ID  = "agr_BNP_001"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/agreements/{AGREEMENT_ID}", headers=headers)
print(response.json())`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/agreements" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 3e9a71b2-84cd-4f06-a1b7-92c5d0e3f847" \\
  -d '{
    "account_id": "acc_007",
    "type": "credit",
    "name": "BHMS / BNP Paribas Credit Agreement",
    "principal_amount": 50000000.00,
    "currency": "GBP",
    "interest_rate": 4.25,
    "start_date": "2026-01-15",
    "maturity_date": "2031-01-15"
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
    "account_id": "acc_007",
    "type": "credit",
    "name": "BHMS / BNP Paribas Credit Agreement",
    "principal_amount": 50000000.00,
    "currency": "GBP",
    "interest_rate": 4.25,
    "start_date": "2026-01-15",
    "maturity_date": "2031-01-15",
}

response = requests.post(f"{BASE_URL}/agreements", json=payload, headers=headers)
print(response.json())`;

const UPDATE_CURL = `curl -X PATCH "https://api.dzenterprise.io/v1/agreements/agr_BNP_001" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"interest_rate": 4.50, "status": "active"}'`;

const UPDATE_PYTHON = `import requests

BASE_URL     = "https://api.dzenterprise.io/v1"
AGREEMENT_ID = "agr_BNP_001"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {"interest_rate": 4.50, "status": "active"}

response = requests.patch(
    f"{BASE_URL}/agreements/{AGREEMENT_ID}", json=payload, headers=headers
)
print(response.json())`;

const DELETE_CURL = `curl -X DELETE "https://api.dzenterprise.io/v1/agreements/agr_BNP_001" \\
  -H "Authorization: Bearer {access_token}"`;

const DELETE_PYTHON = `import requests

BASE_URL     = "https://api.dzenterprise.io/v1"
AGREEMENT_ID = "agr_BNP_001"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.delete(f"{BASE_URL}/agreements/{AGREEMENT_ID}", headers=headers)
print(response.status_code)  # 204`;

const LIST_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const query = new URLSearchParams({ limit: 20, offset: 0, status: 'active' });

const response = await fetch(\`\${BASE_URL}/agreements?\${query}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

const { data } = await response.json();
console.log(data);`;

const GET_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const agreementId = 'agr_BNP_001';

const response = await fetch(\`\${BASE_URL}/agreements/\${agreementId}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(await response.json());`;

const CREATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const response = await fetch(\`\${BASE_URL}/agreements\`, {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    account_id: 'acc_007',
    type: 'credit',
    name: 'BHMS / BNP Paribas Credit Agreement',
    principal_amount: 50000000.0,
    currency: 'GBP',
    interest_rate: 4.25,
    start_date: '2026-01-15',
    maturity_date: '2031-01-15',
  }),
});

console.log(await response.json());`;

const UPDATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const agreementId = 'agr_BNP_001';

const response = await fetch(\`\${BASE_URL}/agreements/\${agreementId}\`, {
  method: 'PATCH',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ interest_rate: 4.5, status: 'active' }),
});

console.log(await response.json());`;

const DELETE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const agreementId = 'agr_BNP_001';

const response = await fetch(\`\${BASE_URL}/agreements/\${agreementId}\`, {
  method: 'DELETE',
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(response.status); // 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AgreementsPage() {
  return (
    <Layout title="Agreements | DZ API" description="CRUD endpoints for managing Credit Agreements.">
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Legal & Compliance</div>
          <h1 className={styles.pageTitle}>Credit Agreements</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Create and manage Credit Agreements linked to your Accounts. Each Agreement
            captures the legal and financial terms of a credit facility established between
            your organisation and a counterparty.
          </p>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Credit Agreements are scoped to an <Link to="/api/accounts" style={{ color: '#a78bfa' }}>Account</Link> and
            are independent of Portfolios. A single Account may have multiple Credit Agreements
            with different counterparties, currencies, and maturity profiles.
          </p>

          <div className={styles.pageAccent} />

        </div>

        {/* ── GET /agreements ── */}
        <EndpointSection
          id="list-agreements"
          method="GET"
          path="/agreements"
          title="List credit agreements"
          description="Returns a paginated list of Credit Agreements. Filter by account, status, or type to narrow results."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'limit',      type: 'integer', required: false, description: 'Number of results to return. Default: 20, max: 100.' },
              { name: 'offset',     type: 'integer', required: false, description: 'Number of results to skip. Use for pagination. Default: 0.' },
              { name: 'account_id', type: 'string',  required: false, description: 'Filter agreements by the associated account ID.' },
              { name: 'status',     type: 'string',  required: false, description: `Filter by status. One of: ${AGREEMENT_STATUSES}.` },
              { name: 'type',       type: 'string',  required: false, description: `Filter by agreement type. Currently only: ${AGREEMENT_TYPES}.` },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} javascript={LIST_JS} />
          <FieldTable caption="Response fields" fields={LIST_FIELDS} />
          <ResponseBlock status={200} json={AGREEMENT_LIST} />
        </EndpointSection>

        {/* ── GET /agreements/:id ── */}
        <EndpointSection
          id="get-agreement"
          method="GET"
          path="/agreements/{id}"
          title="Get credit agreement by ID"
          description="Retrieves the full details of a single Credit Agreement by its unique identifier."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique agreement ID (e.g. agr_BNP_001).' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} javascript={GET_JS} />
          <FieldTable caption="Response fields: Credit Agreement object" fields={AGREEMENT_FIELDS} />
          <ResponseBlock status={200} json={AGREEMENT} />
        </EndpointSection>

        {/* ── POST /agreements ── */}
        <EndpointSection
          id="create-agreement"
          method="POST"
          path="/agreements"
          title="Create credit agreement"
          description="Creates a new Credit Agreement for the specified account. Returns the created resource."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'account_id',       type: 'string',  required: true,  description: 'ID of the Account this agreement is linked to.' },
              { name: 'type',             type: 'string',  required: true,  description: `Agreement type. One of: ${AGREEMENT_TYPES}. Cannot be changed later.` },
              { name: 'name',             type: 'string',  required: true,  description: 'Descriptive name identifying the agreement and counterparty.' },
              { name: 'principal_amount', type: 'number',  required: true,  description: 'Total principal amount of the credit facility.' },
              { name: 'currency',         type: 'string',  required: true,  description: 'ISO 4217 currency code (e.g. GBP, USD, EUR).' },
              { name: 'interest_rate',    type: 'number',  required: true,  description: 'Annual interest rate as a percentage (e.g. 4.25 for 4.25%).' },
              { name: 'start_date',       type: 'string',  required: true,  description: 'Agreement start date. Format: YYYY-MM-DD.' },
              { name: 'maturity_date',    type: 'string',  required: true,  description: 'Agreement maturity date. Format: YYYY-MM-DD.' },
            ]}
          />
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} javascript={CREATE_JS} />
          <FieldTable caption="Response fields: Credit Agreement object" fields={AGREEMENT_FIELDS} />
          <ResponseBlock status={201} json={AGREEMENT} />
        </EndpointSection>

        {/* ── PATCH /agreements/:id ── */}
        <EndpointSection
          id="update-agreement"
          method="PATCH"
          path="/agreements/{id}"
          title="Update credit agreement"
          description="Partially updates a Credit Agreement. Only supplied fields are modified. account_id, currency, and type cannot be changed after creation."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique agreement ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'name',             type: 'string', required: false, description: 'Updated agreement name.' },
              { name: 'principal_amount', type: 'number', required: false, description: 'Updated principal amount.' },
              { name: 'interest_rate',    type: 'number', required: false, description: 'Updated annual interest rate.' },
              { name: 'maturity_date',    type: 'string', required: false, description: 'Updated maturity date. Format: YYYY-MM-DD.' },
              { name: 'status',           type: 'string', required: false, description: `Updated status. One of: ${AGREEMENT_STATUSES}.` },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            <code style={INLINE_CODE}>account_id</code>, <code style={INLINE_CODE}>currency</code>,
            and <code style={INLINE_CODE}>type</code> are fixed at creation. Sending any of them
            returns <code style={INLINE_CODE}>422 validation_failed</code>.
          </p>
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} javascript={UPDATE_JS} />
          <FieldTable caption="Response fields: Credit Agreement object" fields={AGREEMENT_FIELDS} />
          <ResponseBlock status={200} json={{ ...AGREEMENT, interest_rate: 4.50, updated_at: '2026-04-01T09:00:00Z' }} />
        </EndpointSection>

        {/* ── DELETE /agreements/:id ── */}
        <EndpointSection
          id="remove-agreement"
          method="DELETE"
          path="/agreements/{id}"
          title="Remove credit agreement"
          description="Permanently deletes a Credit Agreement. Only agreements with pending or terminated status can be deleted."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique agreement ID to delete.' },
            ]}
          />
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} javascript={DELETE_JS} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>

      </ApiLayout>
    </Layout>
  );
}

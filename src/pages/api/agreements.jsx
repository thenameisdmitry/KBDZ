import React from 'react';
import Layout from '@theme/Layout';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import EndpointSection from '@site/src/components/ApiDocs/EndpointSection';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import ParamTable from '@site/src/components/ApiDocs/ParamTable';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';

// ─── Shared sample data ───────────────────────────────────────────────────────
const AGREEMENT = {
  id: 'agr_BNP_001',
  account_id: 'acc_007',
  type: 'credit',
  name: 'Credit Agreement — BHMS / BNP Paribas',
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
      name: 'Credit Agreement — BHMS / JP Morgan',
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

// ─── cURL / Python snippets ───────────────────────────────────────────────────
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
  -d '{
    "account_id": "acc_007",
    "type": "credit",
    "name": "Credit Agreement — BHMS / BNP Paribas",
    "principal_amount": 50000000.00,
    "currency": "GBP",
    "interest_rate": 4.25,
    "start_date": "2026-01-15",
    "maturity_date": "2031-01-15"
  }'`;

const CREATE_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "account_id": "acc_007",
    "type": "credit",
    "name": "Credit Agreement — BHMS / BNP Paribas",
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
            Credit Agreements are scoped to an <a href="/api/accounts" style={{ color: '#838383', textDecoration: 'none' }}>Account</a> and
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
              { name: 'status',     type: 'string',  required: false, description: 'Filter by status. One of: active, expired, terminated, pending.' },
              { name: 'type',       type: 'string',  required: false, description: 'Filter by agreement type. One of: credit, collateral, master.' },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} />
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
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} />
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
              { name: 'type',             type: 'string',  required: true,  description: 'Agreement type. One of: credit, collateral, master.' },
              { name: 'name',             type: 'string',  required: true,  description: 'Descriptive name identifying the agreement and counterparty.' },
              { name: 'principal_amount', type: 'number',  required: true,  description: 'Total principal amount of the credit facility.' },
              { name: 'currency',         type: 'string',  required: true,  description: 'ISO 4217 currency code (e.g. GBP, USD, EUR).' },
              { name: 'interest_rate',    type: 'number',  required: true,  description: 'Annual interest rate as a percentage (e.g. 4.25 for 4.25%).' },
              { name: 'start_date',       type: 'string',  required: true,  description: 'Agreement start date. Format: YYYY-MM-DD.' },
              { name: 'maturity_date',    type: 'string',  required: true,  description: 'Agreement maturity date. Format: YYYY-MM-DD.' },
            ]}
          />
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} />
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
              { name: 'status',           type: 'string', required: false, description: 'Updated status. One of: active, expired, terminated, pending.' },
            ]}
          />
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} />
          <ResponseBlock status={200} json={{ ...AGREEMENT, interest_rate: 4.50, updated_at: '2026-04-01T09:00:00Z' }} />
        </EndpointSection>

        {/* ── DELETE /agreements/:id ── */}
        <EndpointSection
          id="remove-agreement"
          method="DELETE"
          path="/agreements/{id}"
          title="Remove credit agreement"
          description="Permanently deletes a Credit Agreement. Only agreements with status pending or terminated can be deleted."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique agreement ID to delete.' },
            ]}
          />
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>

      </ApiLayout>
    </Layout>
  );
}

import React from 'react';
import Layout from '@theme/Layout';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import EndpointSection from '@site/src/components/ApiDocs/EndpointSection';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import ParamTable from '@site/src/components/ApiDocs/ParamTable';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';

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
  data: [ACCOUNT, { ...ACCOUNT, id: 'acc_006', owner_id: 'alec_t', name: 'Operating Account', type: 'operating', balance: 42000000.00 }],
  total: 2,
  limit: 20,
  offset: 0,
};

// ─── cURL / Python snippets ───────────────────────────────────────────────────
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

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/accounts/acc_007" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"
ACCOUNT_ID = "acc_007"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/accounts/{ACCOUNT_ID}", headers=headers)
print(response.json())`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/accounts" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner_id": "usr_1234abcd",
    "name": "Main Trading Account",
    "type": "trading",
    "currency": "USD"
  }'`;

const CREATE_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "owner_id": "usr_1234abcd",
    "name": "Main Trading Account",
    "type": "trading",
    "currency": "USD",
}

response = requests.post(f"{BASE_URL}/accounts", json=payload, headers=headers)
print(response.json())`;

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

payload = {"name": "Primary Trading Account", "status": "active"}

response = requests.patch(
    f"{BASE_URL}/accounts/{ACCOUNT_ID}", json=payload, headers=headers
)
print(response.json())`;

const DELETE_CURL = `curl -X DELETE "https://api.dzenterprise.io/v1/accounts/acc_007" \\
  -H "Authorization: Bearer {access_token}"`;

const DELETE_PYTHON = `import requests

BASE_URL   = "https://api.dzenterprise.io/v1"
ACCOUNT_ID = "acc_007"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.delete(f"{BASE_URL}/accounts/{ACCOUNT_ID}", headers=headers)
print(response.status_code)  # 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AccountsPage() {
  return (
    <Layout title="Accounts | DZ API" description="CRUD endpoints for managing DZ accounts.">
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Reference Data</div>
          <h1 className={styles.pageTitle}>Accounts</h1>
            <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
              Create and manage Accounts within your environment. API supports full CRUD operations.
            </p>
            <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
              To learn more about Account management, Account parameters, and how to control your Reference Data in the DZ environment, proceed to the <a href="/docs/stub" style={{ color: '#838383', textDecoration: 'none'}}>Reference Data User Guide</a>.
            </p>
          
          <div className={styles.pageAccent} />
          
        </div>

        {/* ── GET /accounts ── */}
        <EndpointSection
          id="list-accounts"
          method="GET"
          path="/accounts"
          title="List accounts"
          description="Returns a paginated list of accounts. Filter by status to narrow results."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'limit',  type: 'integer', required: false, description: 'Number of results to return. Default: 20, max: 100.' },
              { name: 'offset', type: 'integer', required: false, description: 'Number of results to skip. Use for pagination. Default: 0.' },
              { name: 'status', type: 'string',  required: false, description: 'Filter by account status. One of: active, suspended, closed.' },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} />
          <ResponseBlock status={200} json={ACCOUNT_LIST} />
        </EndpointSection>

        {/* ── GET /accounts/:id ── */}
        <EndpointSection
          id="get-account"
          method="GET"
          path="/accounts/{id}"
          title="Get account by ID"
          description="Retrieves the full details of a single account by its unique identifier."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique account ID (e.g. acc_007).' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} />
          <ResponseBlock status={200} json={ACCOUNT} />
        </EndpointSection>

        {/* ── POST /accounts ── */}
        <EndpointSection
          id="create-account"
          method="POST"
          path="/accounts"
          title="Create account"
          description="Creates a new account for the specified owner. Returns the created resource."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'owner_id',  type: 'string', required: true,  description: 'ID of the user who owns this account.' },
              { name: 'name',      type: 'string', required: true,  description: 'Human-readable label for the account.' },
              { name: 'type',      type: 'string', required: true,  description: 'Account type. One of: trading, savings, custody.' },
              { name: 'currency',  type: 'string', required: true,  description: 'ISO 4217 currency code (e.g. USD, EUR, GBP).' },
            ]}
          />
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} />
          <ResponseBlock status={201} json={ACCOUNT} />
        </EndpointSection>

        {/* ── PATCH /accounts/:id ── */}
        <EndpointSection
          id="update-account"
          method="PATCH"
          path="/accounts/{id}"
          title="Update account"
          description="Partially updates an account. Only supplied fields are modified."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique account ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'name',   type: 'string', required: false, description: 'New display name for the account.' },
              { name: 'status', type: 'string', required: false, description: 'New status. One of: active, suspended, closed.' },
            ]}
          />
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} />
          <ResponseBlock status={200} json={{ ...ACCOUNT, name: 'Primary Trading Account', updated_at: '2024-04-01T09:00:00Z' }} />
        </EndpointSection>

        {/* ── DELETE /accounts/:id ── */}
        <EndpointSection
          id="remove-account"
          method="DELETE"
          path="/accounts/{id}"
          title="Remove account"
          description="Permanently deletes an account and all associated data. This action cannot be undone."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique account ID to delete.' },
            ]}
          />
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>
      </ApiLayout>
    </Layout>
  );
}

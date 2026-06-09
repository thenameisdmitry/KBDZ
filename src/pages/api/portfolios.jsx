import React from 'react';
import Layout from '@theme/Layout';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import EndpointSection from '@site/src/components/ApiDocs/EndpointSection';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import ParamTable from '@site/src/components/ApiDocs/ParamTable';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';

// ─── Shared sample data ───────────────────────────────────────────────────────
const PORTFOLIO = {
  portfolio_id: 'prt_BNPParibas_001',
  name: 'BHMS Portfolio BNP Paribas',
  strategy: 'loan benchmarking',
  currency: 'GBP',
  total_value: 20000000.00,
  status: 'active',
  accounts: [
    {
      id: 'acc_007',
      name: 'BHMS Account 007',
      ownerid: 'james_b',
      type: 'fee',
      allocation_pct: 58.93,
    },
    {
      id: 'acc_8901',
      name: 'US PNGN Account 8901',
      ownerid: 'felix_l',
      type: 'investments',
      allocation_pct: 41.07,
    },
  ],
  created_at: '2026-02-01T08:00:00Z',
  updated_at: '2026-03-25T11:15:00Z',
};

const PORTFOLIO_LIST = {
  data: [
    PORTFOLIO,
    { ...PORTFOLIO, portfolio_id: 'prt_BNY_897', name: 'Derivaties Portfolio', strategy: 'conservative', total_value: 3420000.00 },
  ],
  total: 2,
  limit: 20,
  offset: 0,
};

// ─── Snippets ─────────────────────────────────────────────────────────────────
const LIST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/portfolios?portfolio_id=prt_BNPParibas_001&limit=20" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json"`;

const LIST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

params  = {"portfolio_id": "prt_BNPParibas_001", "limit": 20}
headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/portfolios", params=params, headers=headers)
print(response.json())`;

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/portfolios/prt_BNPParibas_001" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL      = "https://api.dzenterprise.io/v1"
PORTFOLIO_ID  = "prt_BNPParibas_001"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/portfolios/{PORTFOLIO_ID}", headers=headers)
print(response.json())`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/portfolios" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "portfolio_id": "prt_BNPParibas_001",
    "name": "BHMS Portfolio BNP Paribas",
    "strategy": "loan benchmarking",
    "currency": "GBP",
    "accounts": [
      { "id": "acc_007", "allocation_pct": 50.00 },
      { "id": "acc_019", "allocation_pct": 30.00 }
    ]
  }'`;

const CREATE_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "portfolio_id": "prt_BNPParibas_001",
    "name": "BHMS Portfolio BNP Paribas",
    "strategy": "loan benchmarking",
    "currency": "GBP",
    "accounts": [
        {"id": "acc_007", "allocation_pct": 50.00},
        {"id": "acc_019", "allocation_pct": 30.00},
    ],
}

response = requests.post(f"{BASE_URL}/portfolios", json=payload, headers=headers)
print(response.json())`;

const UPDATE_CURL = `curl -X PATCH "https://api.dzenterprise.io/v1/portfolios/prt_JPCHASE_6842" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "JP Portfolio Pink", "strategy": "moderate"}'`;

const UPDATE_PYTHON = `import requests

BASE_URL     = "https://api.dzenterprise.io/v1"
ID = "prt_JPCHASE_6842"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {"name": "JP Portfolio Pink", "strategy": "moderate"}

response = requests.patch(
    f"{BASE_URL}/portfolios/{PORTFOLIO_ID}", json=payload, headers=headers
)
print(response.json())`;

const DELETE_CURL = `curl -X DELETE "https://api.dzenterprise.io/v1/portfolios/prt_BNPParibas_001" \\
  -H "Authorization: Bearer {access_token}"`;

const DELETE_PYTHON = `import requests

BASE_URL     = "https://api.dzenterprise.io/v1"
PORTFOLIO_ID = "prt_BNPParibas_001"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.delete(f"{BASE_URL}/portfolios/{PORTFOLIO_ID}", headers=headers)
print(response.status_code)  # 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function PortfoliosPage() {
  return (
    <Layout title="Portfolios | DZ API" description="CRUD endpoints for managing DZ portfolios.">
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Reference Data</div>
          <h1 className={styles.pageTitle}>Portfolios</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Create and manage Portfolios within your environment. API supports full CRUD operations.
          </p>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Portfolios aggragate assets from one or more Accounts. Each portfolio tracks its own total value, currency, and investment strategy.
            To learn more about Portfolios and how to assemble them accross the DZ environment, proceed to the <a href="/docs/stub" style={{ color: '#838383', textDecoration: 'none'}}>Reference Data User Guide</a>. 
          </p>
          
          <div className={styles.pageAccent} />
          
        </div>

        {/* ── GET /portfolios ── */}
        <EndpointSection
          id="list-portfolios"
          method="GET"
          path="/portfolios"
          title="List portfolios"
          description="Returns a paginated list of portfolios. Filter by portfolio id, strategy, or status to narrow results."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'portfolio_id', type: 'string',  required: false, description: 'Filter portfolios by their unique identificator.' },
              { name: 'strategy',   type: 'string',  required: false, description: 'Filter by strategy. One of: conservative, moderate, aggressive.' },
              { name: 'status',     type: 'string',  required: false, description: 'Filter by status. One of: active, paused, closed.' },
              { name: 'limit',      type: 'integer', required: false, description: 'Number of results to return. Default: 20, max: 100.' },
              { name: 'offset',     type: 'integer', required: false, description: 'Pagination offset. Default: 0.' },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} />
          <ResponseBlock status={200} json={PORTFOLIO_LIST} />
        </EndpointSection>

        {/* ── GET /portfolios/:id ── */}
        <EndpointSection
          id="get-portfolio"
          method="GET"
          path="/portfolios/{id}"
          title="Get portfolio by ID"
          description="Retrieves full details for a single portfolio, including current total value."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'portolio_id', type: 'string', required: true, description: 'Unique portfolio ID (e.g. prt_BNPParibas_001).' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} />
          <ResponseBlock status={200} json={PORTFOLIO} />
        </EndpointSection>

        {/* ── POST /portfolios ── */}
        <EndpointSection
          id="create-portfolio"
          method="POST"
          path="/portfolios"
          title="Create portfolio"
          description="Creates a new portfolio under the specified account."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'portfolio_id', type: 'string',   required: true,  description: 'Unique identifier of the Portfolio.' },
              { name: 'name',         type: 'string',   required: true,  description: 'Descriptive name for the portfolio.' },
              { name: 'strategy',     type: 'string',   required: true,  description: 'Investment strategy. One of: conservative, moderate, aggressive.' },
              { name: 'currency',     type: 'string',   required: true,  description: 'ISO 4217 base currency for the portfolio.' },
              { name: 'accounts',     type: 'array',    required: false, description: 'List of accounts investing in this portfolio. Each item contains: id (string), allocation_pct (number).' },
              { name: 'accounts[].id',             type: 'string', required: true,  description: 'Unique identifier of the account.' },
              { name: 'accounts[].allocation_pct', type: 'number', required: true,  description: 'Percentage of the portfolio allocated to this account. All values must sum to 100.' },
            ]}
          />

          {/* ----/NOTE!---- */} 

                <div style={{
                background: '#1a1400',
                border: '1px solid #6a0aaf',
                borderLeft: '15px solid #6a0aaf',
                borderRadius: '6px',
                padding: '16px 16px',
                margin: '0 0 20px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#e0e0e0',
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                lineHeight: 1.6,
              }}>
                <strong>Note:</strong> The <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', background: '#2a1f00', padding: '1px 5px', borderRadius: '3px', color: '#fbbf24' }}>accounts[].id</code> and <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', background: '#2a1f00', padding: '1px 5px', borderRadius: '3px', color: '#fbbf24' }}>accounts[].allocation_pct</code> fields are required only when the <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', background: '#2a1f00', padding: '1px 5px', borderRadius: '3px', color: '#fbbf24' }}>accounts</code> array is provided. If omitted, the portfolio is created with no associated accounts.
              </div> 

          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} />
          <ResponseBlock status={201} json={PORTFOLIO} />
        </EndpointSection>

        {/* ── PATCH /portfolios/:id ── */}
        <EndpointSection
          id="update-portfolio"
          method="PATCH"
          path="/portfolios/{id}"
          title="Update portfolio"
          description="Partially updates a portfolio. Only supplied fields are modified; others remain unchanged."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'portfolio_id', type: 'string', required: true, description: 'Unique portfolio ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'name',     type: 'string', required: false, description: 'New display name for the portfolio.' },
              { name: 'strategy', type: 'string', required: false, description: 'Updated investment strategy.' },
              { name: 'status',   type: 'string', required: false, description: 'New status. One of: active, paused, closed.' },
            ]}
          />
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} />
          <ResponseBlock
            status={200}
            json={{ ...PORTFOLIO, name: 'Core Growth Portfolio', strategy: 'moderate', updated_at: '2026-04-05T10:00:00Z' }}
          />
        </EndpointSection>

        {/* ── DELETE /portfolios/:id ── */}
        <EndpointSection
          id="remove-portfolio"
          method="DELETE"
          path="/portfolios/{id}"
          title="Remove portfolio"
          description="Permanently deletes a portfolio. All associated holdings records will also be removed."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'portfolio_id', type: 'string', required: true, description: 'Unique portfolio ID to delete.' },
            ]}
          />
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>
      </ApiLayout>
    </Layout>
  );
}

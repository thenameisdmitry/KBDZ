import React from 'react';
import Layout from '@theme/Layout';
import ApiLayout from '@site/src/components/ApiDocs/ApiLayout';
import EndpointSection from '@site/src/components/ApiDocs/EndpointSection';
import CodeTabs from '@site/src/components/ApiDocs/CodeTabs';
import ParamTable from '@site/src/components/ApiDocs/ParamTable';
import ResponseBlock from '@site/src/components/ApiDocs/ResponseBlock';
import styles from '@site/src/components/ApiDocs/ApiLayout.module.css';

// ─── Shared sample data ───────────────────────────────────────────────────────
const TRANSACTION = {
  id: 'TN_WIRE_10062026_78',
  account_id: 'acc_007',
  portfolio_id: 'prt_BNPParibas_001',
  type: 'transfer',
  amount: 5000.00,
  currency: 'USD',
  status: 'completed',
  reference: 'TN_MM_100620226_89',
  notes: 'Initial position entry',
  created_at: '2026-03-15T09:45:00Z',
  updated_at: '2026-03-15T09:45:12Z',
};

const TRANSACTION_LIST = {
  data: [
    TRANSACTION,
    { ...TRANSACTION, id: 'TN_CF_100620226_34', type: 'sell', amount: 1200.00, reference: 'TN_CF_100620226_34', status: 'completed' },
    { ...TRANSACTION, id: 'TN_SEC_100620226_55', type: 'deposit', amount: '', currency: '', sec_id: 'TSTL_OP', sedol: '578101D', reference: 'TN_SEC_100620226_55', status: 'pending' },
  ],
  total: 3,
  limit: 20,
  offset: 0,
};

// ─── Snippets ─────────────────────────────────────────────────────────────────
const LIST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/transactions?account_id=acc_007&type=transfer&limit=20" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json"`;

const LIST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

params = {
    "account_id":   "acc_007",
    "type":         "transfer",
    "limit":        20,
    "offset":       0,
}
headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/transactions", params=params, headers=headers)
print(response.json())`;

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/transactions/TN_WIRE_10062026_78" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL        = "https://api.dzenterprise.io/v1"
TRANSACTION_ID  = "TN_WIRE_10062026_78"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(
    f"{BASE_URL}/transactions/{TRANSACTION_ID}", headers=headers
)
print(response.json())`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/transactions" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "account_id":   "acc_007",
    "portfolio_id": "prt_BNPParibas_001",
    "type":         "wire",
    "amount":       5000000.00,
    "currency":     "USD",
    "reference":    "TN_MM_100620226_89",
    "notes":        "Initial position entry"
  }'`;

const CREATE_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "account_id":   "acc_007",
    "portfolio_id": "prt_BNPParibas_001",
    "type":         "wire",
    "amount":       5000000.00,
    "currency":     "USD",
    "reference":    "TN_MM_100620226_89",
    "notes":        "Initial position entry",
}

response = requests.post(f"{BASE_URL}/transactions", json=payload, headers=headers)
print(response.json())`;

const UPDATE_CURL = `curl -X PATCH "https://api.dzenterprise.io/v1/transactions/TN_WIRE_10062026_78" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "completed", "reference": "TN_MM_100620226_89"}'`;

const UPDATE_PYTHON = `import requests

BASE_URL       = "https://api.dzenterprise.io/v1"
TRANSACTION_ID = "TN_WIRE_10062026_78"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "status":    "completed",
    "reference": "TN_MM_100620226_89",
}

response = requests.patch(
    f"{BASE_URL}/transactions/{TRANSACTION_ID}", json=payload, headers=headers
)
print(response.json())`;

const DELETE_CURL = `curl -X DELETE "https://api.dzenterprise.io/v1/transactions/TN_WIRE_10062026_78" \\
  -H "Authorization: Bearer {access_token}"`;

const DELETE_PYTHON = `import requests

BASE_URL       = "https://api.dzenterprise.io/v1"
TRANSACTION_ID = "TN_WIRE_10062026_78"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.delete(
    f"{BASE_URL}/transactions/{TRANSACTION_ID}", headers=headers
)
print(response.status_code)  # 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  return (
    <Layout title="Transactions | DZ API" description="CRUD endpoints for DZ transactions.">
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Financial Operations</div>
          <h1 className={styles.pageTitle}>Transactions</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Submit, process, approve, and reject Transactions of the following types: <b>Wires</b>, <b>Money Markets</b>, <b>Securities</b>, <b>FX Trades</b>, <b>Cashflows</b>, and <b>Loan Tranches</b>.
          </p>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            In <b>DZ Enterprise</b> environment Transactions are orders, which are submitted and processed within the Transactions module. When approved, the Transaction order is issued and sent to the specified institute (Bank, Hedge Fund, Counterparty Broker) for execution. 
            To learn more about Transactions, Transaction workflows, and how to manage Transactions in the DZ Enterprise environment, refer to the <a href="/KBDZ/docs/stub" style={{ color: '#838383', textDecoration: 'none'}}>Transactions Guide</a> .
          </p>
          
          <div className={styles.pageAccent} />
          
        </div>

        {/* ── GET /transactions ── */}
        <EndpointSection
          id="list-transactions"
          method="GET"
          path="/transactions"
          title="List transactions"
          description="Returns a paginated list of transactions. Use query parameters to filter by account, portfolio, type, or status."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'account_id',   type: 'string',  required: false, description: 'Filter by account ID.' },
              { name: 'portfolio_id', type: 'string',  required: false, description: 'Filter by portfolio ID.' },
              { name: 'type',         type: 'string',  required: false, description: 'Transaction type. One of: transfer, sell, deposit, withdrawal, fee.' },
              { name: 'status',       type: 'string',  required: false, description: 'Transaction status. One of: pending, completed, failed, cancelled.' },
              { name: 'limit',        type: 'integer', required: false, description: 'Number of results. Default: 20, max: 100.' },
              { name: 'offset',       type: 'integer', required: false, description: 'Pagination offset. Default: 0.' },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} />
          <ResponseBlock status={200} json={TRANSACTION_LIST} />
        </EndpointSection>

        {/* ── GET /transactions/:id ── */}
        <EndpointSection
          id="get-transaction"
          method="GET"
          path="/transactions/{id}"
          title="Get transaction by ID"
          description="Fetches the full record for a single transaction, including metadata and status."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'Unique transaction ID (e.g. TN_WIRE_10062026_78).' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} />
          <ResponseBlock status={200} json={TRANSACTION} />
        </EndpointSection>

        {/* ── POST /transactions ── */}
        <EndpointSection
          id="create-transaction"
          method="POST"
          path="/transactions"
          title="Create transaction"
          description="Records a new transaction. The transaction is initially set to pending and processed asynchronously."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'account_id',   type: 'string',  required: true,  description: 'Account associated with this transaction.' },
              { name: 'portfolio_id', type: 'string',  required: false, description: 'Portfolio associated with this transaction.' },
              { name: 'type',         type: 'string',  required: true,  description: 'Transaction type: transfer, sell, deposit, withdrawal, fee.' },
              { name: 'amount',       type: 'number',  required: true,  description: 'Transaction amount (positive decimal).' },
              { name: 'currency',     type: 'string',  required: true,  description: 'ISO 4217 currency code for this transaction.' },
              { name: 'reference',    type: 'string',  required: false, description: 'External reference or invoice number for reconciliation.' },
              { name: 'notes',        type: 'string',  required: false, description: 'Free-text notes attached to this transaction.' },
            ]}
          />
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} />
          <ResponseBlock status={201} json={{ ...TRANSACTION, status: 'pending' }} />
        </EndpointSection>

        {/* ── PATCH /transactions/:id ── */}
        <EndpointSection
          id="update-transaction"
          method="PATCH"
          path="/transactions/{id}"
          title="Update transaction"
          description="Updates mutable fields on a transaction. Only pending transactions can have their status changed."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'Unique transaction ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'status',    type: 'string', required: false, description: 'New status. One of: completed, failed, cancelled. Only valid from pending.' },
              { name: 'reference', type: 'string', required: false, description: 'Updated external reference string.' },
              { name: 'notes',     type: 'string', required: false, description: 'Updated notes for the transaction.' },
            ]}
          />
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} />
          <ResponseBlock
            status={200}
            json={{ ...TRANSACTION, status: 'completed', reference: 'TN_MM_100620226_89', updated_at: '2024-03-15T10:00:00Z' }}
          />
        </EndpointSection>

        {/* ── DELETE /transactions/:id ── */}
        <EndpointSection
          id="remove-transaction"
          method="DELETE"
          path="/transactions/{id}"
          title="Remove transaction"
          description="Deletes a transaction record. Only transactions in pending or failed status can be deleted."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'Unique transaction ID to delete.' },
            ]}
          />
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>
      </ApiLayout>
    </Layout>
  );
}

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

// Transaction vocabulary, declared once so the prose, the parameter tables and
// the samples cannot drift apart.
const TX_TYPES = 'wire, money_market, security, fx_trade, cashflow, loan_tranche';
const TX_STATUSES = 'pending, processing, completed, failed, cancelled';

// ─── Shared sample data ───────────────────────────────────────────────────────
const TRANSACTION = {
  id: 'TN_WIRE_10062026_78',
  account_id: 'acc_007',
  portfolio_id: 'prt_BNPParibas_001',
  type: 'wire',
  amount: 5000000.00,
  currency: 'USD',
  status: 'completed',
  reference: 'TN_MM_10062026_89',
  notes: 'Initial position entry',
  created_at: '2026-03-15T09:45:00Z',
  updated_at: '2026-03-15T09:45:12Z',
};

const TRANSACTION_LIST = {
  data: [
    TRANSACTION,
    {
      ...TRANSACTION,
      id: 'TN_CF_10062026_34',
      type: 'cashflow',
      amount: 1200.00,
      reference: 'TN_CF_10062026_34',
      notes: null,
      status: 'completed',
    },
    {
      ...TRANSACTION,
      id: 'TN_SEC_10062026_55',
      type: 'security',
      amount: 750000.00,
      currency: 'GBP',
      reference: 'TN_SEC_10062026_55',
      notes: 'Gilt purchase, settlement T+1',
      status: 'pending',
    },
  ],
  total: 3,
  limit: 20,
  offset: 0,
};

const TRANSACTION_FIELDS = [
  { name: 'id', type: 'string', description: 'Unique Transaction identifier. Opaque, do not parse it.' },
  { name: 'account_id', type: 'string', description: 'Account the Transaction settles against.' },
  { name: 'portfolio_id', type: 'string', description: 'Portfolio the Transaction belongs to.' },
  { name: 'type', type: 'string', description: `Nature of the movement. One of: ${TX_TYPES}.` },
  { name: 'amount', type: 'number', description: 'Movement amount in the major unit of currency. Always positive; direction follows type.' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code for this Transaction.' },
  { name: 'status', type: 'string', description: `Current position in the lifecycle. One of: ${TX_STATUSES}.` },
  { name: 'reference', type: 'string', description: 'Reference carried through to the counterparty and used for reconciliation.' },
  { name: 'notes', type: 'string', description: 'Free-text note, or null when none was supplied.' },
  { name: 'created_at', type: 'string', description: 'RFC 3339 timestamp in UTC of submission.' },
  { name: 'updated_at', type: 'string', description: 'RFC 3339 timestamp in UTC of the last status change.' },
];

const LIST_FIELDS = [
  { name: 'data', type: 'array', description: 'The page of Transaction objects. Empty when nothing matches, never null.' },
  { name: 'total', type: 'integer', description: 'Total Transactions matching the filter, across all pages.' },
  { name: 'limit', type: 'integer', description: 'The limit applied to this response, after clamping to 100.' },
  { name: 'offset', type: 'integer', description: 'The offset applied to this response.' },
];

// ─── Snippets ─────────────────────────────────────────────────────────────────
const LIST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/transactions?account_id=acc_007&type=wire&limit=20" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json"`;

const LIST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

params = {
    "account_id": "acc_007",
    "type":       "wire",
    "limit":      20,
    "offset":     0,
}
headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/transactions", params=params, headers=headers)
print(response.json())`;

const LIST_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const query = new URLSearchParams({
  account_id: 'acc_007',
  type: 'wire',
  limit: 20,
  offset: 0,
});

const response = await fetch(\`\${BASE_URL}/transactions?\${query}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

const { data } = await response.json();
console.log(data);`;

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/transactions/TN_WIRE_10062026_78" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL       = "https://api.dzenterprise.io/v1"
TRANSACTION_ID = "TN_WIRE_10062026_78"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(
    f"{BASE_URL}/transactions/{TRANSACTION_ID}", headers=headers
)
print(response.json())`;

const GET_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const transactionId = 'TN_WIRE_10062026_78';

const response = await fetch(\`\${BASE_URL}/transactions/\${transactionId}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(await response.json());`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/transactions" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 5f2b8c14-9d7a-4e31-b6c0-1a2f3e4d5c6b" \\
  -d '{
    "account_id":   "acc_007",
    "portfolio_id": "prt_BNPParibas_001",
    "type":         "wire",
    "amount":       5000000.00,
    "currency":     "USD",
    "reference":    "TN_MM_10062026_89",
    "notes":        "Initial position entry"
  }'`;

const CREATE_PYTHON = `import uuid
import requests

BASE_URL = "https://api.dzenterprise.io/v1"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
    # Generate once per payment, reuse on every retry.
    "Idempotency-Key": str(uuid.uuid4()),
}

payload = {
    "account_id":   "acc_007",
    "portfolio_id": "prt_BNPParibas_001",
    "type":         "wire",
    "amount":       5000000.00,
    "currency":     "USD",
    "reference":    "TN_MM_10062026_89",
    "notes":        "Initial position entry",
}

response = requests.post(f"{BASE_URL}/transactions", json=payload, headers=headers)
print(response.json())`;

const CREATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const response = await fetch(\`\${BASE_URL}/transactions\`, {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    // Generate once per payment, reuse on every retry.
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    account_id: 'acc_007',
    portfolio_id: 'prt_BNPParibas_001',
    type: 'wire',
    amount: 5000000.0,
    currency: 'USD',
    reference: 'TN_MM_10062026_89',
    notes: 'Initial position entry',
  }),
});

console.log(await response.json());`;

const UPDATE_CURL = `curl -X PATCH "https://api.dzenterprise.io/v1/transactions/TN_WIRE_10062026_78" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "completed", "reference": "TN_MM_10062026_89"}'`;

const UPDATE_PYTHON = `import requests

BASE_URL       = "https://api.dzenterprise.io/v1"
TRANSACTION_ID = "TN_WIRE_10062026_78"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "status":    "completed",
    "reference": "TN_MM_10062026_89",
}

response = requests.patch(
    f"{BASE_URL}/transactions/{TRANSACTION_ID}", json=payload, headers=headers
)
print(response.json())`;

const UPDATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const transactionId = 'TN_WIRE_10062026_78';

const response = await fetch(\`\${BASE_URL}/transactions/\${transactionId}\`, {
  method: 'PATCH',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ status: 'completed', reference: 'TN_MM_10062026_89' }),
});

console.log(await response.json());`;

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

const DELETE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const transactionId = 'TN_WIRE_10062026_78';

const response = await fetch(\`\${BASE_URL}/transactions/\${transactionId}\`, {
  method: 'DELETE',
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(response.status); // 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  return (
    <Layout title="Transactions | DZ API" description="CRUD endpoints for submitting and processing DZ Transactions.">
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Financial Operations</div>
          <h1 className={styles.pageTitle}>Transactions</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Submit, process, approve, and reject Transactions of six types:{' '}
            <code style={INLINE_CODE}>wire</code>, <code style={INLINE_CODE}>money_market</code>,{' '}
            <code style={INLINE_CODE}>security</code>, <code style={INLINE_CODE}>fx_trade</code>,{' '}
            <code style={INLINE_CODE}>cashflow</code>, and{' '}
            <code style={INLINE_CODE}>loan_tranche</code>.
          </p>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            In the DZ Enterprise environment, a Transaction is an order submitted and processed
            within the Transactions module. Once approved, the order is issued and sent to the
            named institution (bank, hedge fund, or counterparty broker) for execution. For
            Transaction workflows, see the{' '}
            <Link to="/docs/stub" style={{ color: '#a78bfa' }}>Transactions Guide</Link>.
          </p>

          <div className={styles.pageAccent} />
        </div>

        {/* ── GET /transactions ── */}
        <EndpointSection
          id="list-transactions"
          method="GET"
          path="/transactions"
          title="List transactions"
          description="Returns a paginated list of Transactions. Filter by account, portfolio, type, or status."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'account_id', type: 'string', required: false, description: 'Filter by Account ID.' },
              { name: 'portfolio_id', type: 'string', required: false, description: 'Filter by Portfolio ID.' },
              { name: 'type', type: 'string', required: false, description: `Transaction type. One of: ${TX_TYPES}.` },
              { name: 'status', type: 'string', required: false, description: `Transaction status. One of: ${TX_STATUSES}.` },
              { name: 'limit', type: 'integer', required: false, description: 'Results per page. Default: 20. Maximum: 100.' },
              { name: 'offset', type: 'integer', required: false, description: 'Results to skip before the page starts. Default: 0.' },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} javascript={LIST_JS} />
          <FieldTable caption="Response fields" fields={LIST_FIELDS} />
          <ResponseBlock status={200} json={TRANSACTION_LIST} />
        </EndpointSection>

        {/* ── GET /transactions/:id ── */}
        <EndpointSection
          id="get-transaction"
          method="GET"
          path="/transactions/{id}"
          title="Get transaction by ID"
          description="Fetches the full record for a single Transaction, including metadata and status."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'Unique Transaction ID, for example TN_WIRE_10062026_78.' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} javascript={GET_JS} />
          <FieldTable caption="Response fields — Transaction object" fields={TRANSACTION_FIELDS} />
          <ResponseBlock status={200} json={TRANSACTION} />
        </EndpointSection>

        {/* ── POST /transactions ── */}
        <EndpointSection
          id="create-transaction"
          method="POST"
          path="/transactions"
          title="Create transaction"
          description="Records a Transaction. It starts in pending status and is processed asynchronously."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'account_id', type: 'string', required: true, description: 'Account the Transaction settles against.' },
              { name: 'portfolio_id', type: 'string', required: true, description: 'Portfolio the Transaction belongs to.' },
              { name: 'type', type: 'string', required: true, description: `Transaction type. One of: ${TX_TYPES}.` },
              { name: 'amount', type: 'number', required: true, description: 'Positive decimal in the major unit of currency. Direction follows type.' },
              { name: 'currency', type: 'string', required: true, description: 'ISO 4217 currency code for this Transaction.' },
              { name: 'reference', type: 'string', required: false, description: 'Reference carried through to the counterparty for reconciliation.' },
              { name: 'notes', type: 'string', required: false, description: 'Free-text note attached to this Transaction.' },
            ]}
          />
          <div style={{
            background: '#161a24',
            border: '1px solid #6a0aaf',
            borderLeft: '4px solid #6a0aaf',
            borderRadius: '6px',
            padding: '16px',
            margin: '0 0 20px',
            fontSize: '14px',
            color: '#e0e0e0',
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            lineHeight: 1.6,
          }}>
            <strong>Always send an</strong> <code style={INLINE_CODE}>Idempotency-Key</code>. This
            endpoint moves money: without a key, a network timeout leaves you unable to tell
            whether the Transaction was created, and a blind retry can issue the order twice.
            Generate one key per payment and reuse it on every attempt.
          </div>
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} javascript={CREATE_JS} />
          <FieldTable caption="Response fields — Transaction object" fields={TRANSACTION_FIELDS} />
          <ResponseBlock
            status={201}
            json={{ ...TRANSACTION, status: 'pending', updated_at: '2026-03-15T09:45:00Z' }}
          />
        </EndpointSection>

        {/* ── PATCH /transactions/:id ── */}
        <EndpointSection
          id="update-transaction"
          method="PATCH"
          path="/transactions/{id}"
          title="Update transaction"
          description="Updates the mutable fields of a Transaction. Only a pending Transaction can have its status changed."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'Unique Transaction ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'status', type: 'string', required: false, description: 'New status. One of: completed, failed, cancelled. Valid only from pending.' },
              { name: 'reference', type: 'string', required: false, description: 'Updated reference string.' },
              { name: 'notes', type: 'string', required: false, description: 'Updated note. Send null to clear it.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            Changing the status of a Transaction that has left{' '}
            <code style={INLINE_CODE}>pending</code> returns{' '}
            <code style={INLINE_CODE}>409 conflict</code>. Settled money movements are part of the
            audit trail and cannot be rewritten.
          </p>
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} javascript={UPDATE_JS} />
          <FieldTable caption="Response fields — Transaction object" fields={TRANSACTION_FIELDS} />
          <ResponseBlock
            status={200}
            json={{ ...TRANSACTION, status: 'completed', updated_at: '2026-03-15T10:00:00Z' }}
          />
        </EndpointSection>

        {/* ── DELETE /transactions/:id ── */}
        <EndpointSection
          id="remove-transaction"
          method="DELETE"
          path="/transactions/{id}"
          title="Remove transaction"
          description="Deletes a Transaction record. Only Transactions with pending or failed status can be deleted."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'Unique Transaction ID to delete.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            A completed Transaction cannot be deleted and returns{' '}
            <code style={INLINE_CODE}>409 conflict</code>. Reverse it with a compensating
            Transaction instead.
          </p>
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} javascript={DELETE_JS} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>
      </ApiLayout>
    </Layout>
  );
}

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

// Payment vocabulary, declared once so the prose, the parameter tables and the
// samples cannot drift apart.
const PAYMENT_METHODS = 'swift, sepa, faster_payments, internal';
const PAYMENT_STATUSES = 'pending, processing, settled, failed, returned, cancelled';
const FEE_BEARERS = 'payer, beneficiary, shared';

// ─── Shared sample data ───────────────────────────────────────────────────────
const PAYMENT = {
  id: 'pay_10062026_441',
  account_id: 'acc_007',
  custodian_id: 'cus_BNP_001',
  method: 'swift',
  payer_name: 'BHMS Master Fund Ltd',
  payer_account: 'GB29NWBK60161331926819',
  beneficiary_name: 'Northgate Capital Partners',
  beneficiary_account: 'FR7630006000011234567890189',
  amount: 2400000.00,
  currency: 'EUR',
  fee_amount: 45.00,
  fee_bearer: 'shared',
  value_date: '2026-06-12',
  reference: 'INV-2026-0441 capital call',
  status: 'settled',
  created_at: '2026-06-10T08:20:00Z',
  updated_at: '2026-06-12T06:05:00Z',
};

const PAYMENT_LIST = {
  data: [
    PAYMENT,
    {
      ...PAYMENT,
      id: 'pay_10062026_442',
      method: 'faster_payments',
      beneficiary_name: 'Halloway Services Ltd',
      beneficiary_account: 'GB94BARC10201530093459',
      amount: 18750.00,
      currency: 'GBP',
      fee_amount: 0.00,
      fee_bearer: 'payer',
      reference: 'INV-2026-0442 custody fees',
      status: 'pending',
      updated_at: '2026-06-10T08:20:00Z',
    },
  ],
  total: 2,
  limit: 20,
  offset: 0,
};

const PAYMENT_FIELDS = [
  { name: 'id', type: 'string', description: 'Unique Payment identifier. Opaque, do not parse it.' },
  { name: 'account_id', type: 'string', description: 'Account the Payment is debited from.' },
  { name: 'custodian_id', type: 'string', description: 'Custodian that settles the Payment.' },
  { name: 'method', type: 'string', description: `Settlement rail. One of: ${PAYMENT_METHODS}.` },
  { name: 'payer_name', type: 'string', description: 'Legal name of the paying party.' },
  { name: 'payer_account', type: 'string', description: 'IBAN or local account number the funds leave from.' },
  { name: 'beneficiary_name', type: 'string', description: 'Legal name of the receiving party.' },
  { name: 'beneficiary_account', type: 'string', description: 'IBAN or local account number the funds arrive at.' },
  { name: 'amount', type: 'number', description: 'Payment amount in the major unit of currency, excluding fees.' },
  { name: 'currency', type: 'string', description: 'ISO 4217 code for both amount and fee_amount.' },
  { name: 'fee_amount', type: 'number', description: 'Settlement fee charged by the Custodian. Zero when the rail is free.' },
  { name: 'fee_bearer', type: 'string', description: `Who carries the fee. One of: ${FEE_BEARERS}.` },
  { name: 'value_date', type: 'string', description: 'ISO 8601 date on which the funds are due to clear.' },
  { name: 'reference', type: 'string', description: 'Remittance information shown on the beneficiary statement.' },
  { name: 'status', type: 'string', description: `Position in the settlement lifecycle. One of: ${PAYMENT_STATUSES}.` },
  { name: 'created_at', type: 'string', description: 'RFC 3339 timestamp in UTC of initiation.' },
  { name: 'updated_at', type: 'string', description: 'RFC 3339 timestamp in UTC of the last status change.' },
];

const LIST_FIELDS = [
  { name: 'data', type: 'array', description: 'The page of Payment objects. Empty when nothing matches, never null.' },
  { name: 'total', type: 'integer', description: 'Total Payments matching the filter, across all pages.' },
  { name: 'limit', type: 'integer', description: 'The limit applied to this response, after clamping to 100.' },
  { name: 'offset', type: 'integer', description: 'The offset applied to this response.' },
];

// ─── Snippets ─────────────────────────────────────────────────────────────────
const LIST_CURL = `curl -X GET "https://api.dzenterprise.io/v1/payments?account_id=acc_007&status=settled&limit=20" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json"`;

const LIST_PYTHON = `import requests

BASE_URL = "https://api.dzenterprise.io/v1"

params = {
    "account_id": "acc_007",
    "status":     "settled",
    "limit":      20,
    "offset":     0,
}
headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/payments", params=params, headers=headers)
print(response.json()["data"])`;

const LIST_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const query = new URLSearchParams({
  account_id: 'acc_007',
  status: 'settled',
  limit: 20,
  offset: 0,
});

const response = await fetch(\`\${BASE_URL}/payments?\${query}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

const { data } = await response.json();
console.log(data);`;

const GET_CURL = `curl -X GET "https://api.dzenterprise.io/v1/payments/pay_10062026_441" \\
  -H "Authorization: Bearer {access_token}"`;

const GET_PYTHON = `import requests

BASE_URL   = "https://api.dzenterprise.io/v1"
PAYMENT_ID = "pay_10062026_441"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.get(f"{BASE_URL}/payments/{PAYMENT_ID}", headers=headers)
print(response.json())`;

const GET_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const paymentId = 'pay_10062026_441';

const response = await fetch(\`\${BASE_URL}/payments/\${paymentId}\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(await response.json());`;

const CREATE_CURL = `curl -X POST "https://api.dzenterprise.io/v1/payments" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: e47ac10b-58cc-4372-a567-0e02b2c3d479" \\
  -d '{
    "account_id":          "acc_007",
    "custodian_id":        "cus_BNP_001",
    "method":              "swift",
    "beneficiary_name":    "Northgate Capital Partners",
    "beneficiary_account": "FR7630006000011234567890189",
    "amount":              2400000.00,
    "currency":            "EUR",
    "fee_bearer":          "shared",
    "value_date":          "2026-06-12",
    "reference":           "INV-2026-0441 capital call"
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
    "account_id":          "acc_007",
    "custodian_id":        "cus_BNP_001",
    "method":              "swift",
    "beneficiary_name":    "Northgate Capital Partners",
    "beneficiary_account": "FR7630006000011234567890189",
    "amount":              2400000.00,
    "currency":            "EUR",
    "fee_bearer":          "shared",
    "value_date":          "2026-06-12",
    "reference":           "INV-2026-0441 capital call",
}

response = requests.post(f"{BASE_URL}/payments", json=payload, headers=headers)
print(response.json())`;

const CREATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';

const response = await fetch(\`\${BASE_URL}/payments\`, {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
    // Generate once per payment, reuse on every retry.
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    account_id: 'acc_007',
    custodian_id: 'cus_BNP_001',
    method: 'swift',
    beneficiary_name: 'Northgate Capital Partners',
    beneficiary_account: 'FR7630006000011234567890189',
    amount: 2400000.0,
    currency: 'EUR',
    fee_bearer: 'shared',
    value_date: '2026-06-12',
    reference: 'INV-2026-0441 capital call',
  }),
});

console.log(await response.json());`;

const UPDATE_CURL = `curl -X PATCH "https://api.dzenterprise.io/v1/payments/pay_10062026_442" \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{"value_date": "2026-06-15", "reference": "INV-2026-0442 custody fees Q2"}'`;

const UPDATE_PYTHON = `import requests

BASE_URL   = "https://api.dzenterprise.io/v1"
PAYMENT_ID = "pay_10062026_442"

headers = {
    "Authorization": "Bearer {access_token}",
    "Content-Type": "application/json",
}

payload = {
    "value_date": "2026-06-15",
    "reference":  "INV-2026-0442 custody fees Q2",
}

response = requests.patch(
    f"{BASE_URL}/payments/{PAYMENT_ID}", json=payload, headers=headers
)
print(response.json())`;

const UPDATE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const paymentId = 'pay_10062026_442';

const response = await fetch(\`\${BASE_URL}/payments/\${paymentId}\`, {
  method: 'PATCH',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    value_date: '2026-06-15',
    reference: 'INV-2026-0442 custody fees Q2',
  }),
});

console.log(await response.json());`;

const DELETE_CURL = `curl -X DELETE "https://api.dzenterprise.io/v1/payments/pay_10062026_442" \\
  -H "Authorization: Bearer {access_token}"`;

const DELETE_PYTHON = `import requests

BASE_URL   = "https://api.dzenterprise.io/v1"
PAYMENT_ID = "pay_10062026_442"

headers = {"Authorization": "Bearer {access_token}"}

response = requests.delete(f"{BASE_URL}/payments/{PAYMENT_ID}", headers=headers)
print(response.status_code)  # 204`;

const DELETE_JS = `const BASE_URL = 'https://api.dzenterprise.io/v1';
const paymentId = 'pay_10062026_442';

const response = await fetch(\`\${BASE_URL}/payments/\${paymentId}\`, {
  method: 'DELETE',
  headers: { Authorization: \`Bearer \${accessToken}\` },
});

console.log(response.status); // 204`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  return (
    <Layout
      title="Payments | DZ API"
      description="CRUD endpoints for initiating and settling Payments through your Custodians."
    >
      <ApiLayout>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderMeta}>Financial Operations</div>
          <h1 className={styles.pageTitle}>Payments</h1>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            Initiate and track Payments across four settlement rails:{' '}
            <code style={INLINE_CODE}>swift</code>, <code style={INLINE_CODE}>sepa</code>,{' '}
            <code style={INLINE_CODE}>faster_payments</code>, and{' '}
            <code style={INLINE_CODE}>internal</code>. The API supports full CRUD operations.
          </p>
          <p className={styles.pageSubtitle} style={{ marginBottom: '10px' }}>
            A Payment debits an{' '}
            <Link to="/api/accounts" style={{ color: '#a78bfa' }}>Account</Link> and settles through
            the <Link to="/api/custodians" style={{ color: '#a78bfa' }}>Custodian</Link> that holds
            it. Where a{' '}
            <Link to="/api/transactions" style={{ color: '#a78bfa' }}>Transaction</Link> records the
            intent to move value, a Payment is the instruction that actually moves the cash.
            Pagination, idempotency, and error handling follow the shared{' '}
            <Link to="/api/conventions" style={{ color: '#a78bfa' }}>Conventions</Link>.
          </p>

          <div className={styles.pageAccent} />
        </div>

        {/* ── GET /payments ── */}
        <EndpointSection
          id="list-payments"
          method="GET"
          path="/payments"
          title="List payments"
          description="Returns a paginated list of Payments. Filter by account, custodian, method, or status."
          noDivider
        >
          <ParamTable
            caption="Query parameters"
            params={[
              { name: 'account_id', type: 'string', required: false, description: 'Filter by the debited Account ID.' },
              { name: 'custodian_id', type: 'string', required: false, description: 'Filter by the settling Custodian ID.' },
              { name: 'method', type: 'string', required: false, description: `Settlement rail. One of: ${PAYMENT_METHODS}.` },
              { name: 'status', type: 'string', required: false, description: `Payment status. One of: ${PAYMENT_STATUSES}.` },
              { name: 'currency', type: 'string', required: false, description: 'Filter by ISO 4217 currency code.' },
              { name: 'limit', type: 'integer', required: false, description: 'Results per page. Default: 20. Maximum: 100.' },
              { name: 'offset', type: 'integer', required: false, description: 'Results to skip before the page starts. Default: 0.' },
            ]}
          />
          <CodeTabs curl={LIST_CURL} python={LIST_PYTHON} javascript={LIST_JS} />
          <FieldTable caption="Response fields" fields={LIST_FIELDS} />
          <ResponseBlock status={200} json={PAYMENT_LIST} />
        </EndpointSection>

        {/* ── GET /payments/:id ── */}
        <EndpointSection
          id="get-payment"
          method="GET"
          path="/payments/{id}"
          title="Get payment by ID"
          description="Fetches the full record for a single Payment, including fees and settlement status."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Payment ID, for example pay_10062026_441.' },
            ]}
          />
          <CodeTabs curl={GET_CURL} python={GET_PYTHON} javascript={GET_JS} />
          <FieldTable caption="Response fields: Payment object" fields={PAYMENT_FIELDS} />
          <ResponseBlock status={200} json={PAYMENT} />
        </EndpointSection>

        {/* ── POST /payments ── */}
        <EndpointSection
          id="create-payment"
          method="POST"
          path="/payments"
          title="Create payment"
          description="Initiates a Payment. It starts in pending status and settles asynchronously."
        >
          <ParamTable
            caption="Request body"
            params={[
              { name: 'account_id', type: 'string', required: true, description: 'Account to debit. Must be active and hold sufficient balance.' },
              { name: 'custodian_id', type: 'string', required: true, description: 'Custodian that settles the Payment. Must be active.' },
              { name: 'method', type: 'string', required: true, description: `Settlement rail. One of: ${PAYMENT_METHODS}.` },
              { name: 'beneficiary_name', type: 'string', required: true, description: 'Legal name of the receiving party.' },
              { name: 'beneficiary_account', type: 'string', required: true, description: 'IBAN or local account number of the beneficiary.' },
              { name: 'amount', type: 'number', required: true, description: 'Positive decimal in the major unit of currency, excluding fees.' },
              { name: 'currency', type: 'string', required: true, description: 'ISO 4217 currency code. Must be supported by the chosen method.' },
              { name: 'fee_bearer', type: 'string', required: false, description: `Who carries the settlement fee. One of: ${FEE_BEARERS}. Default: shared.` },
              { name: 'value_date', type: 'string', required: false, description: 'ISO 8601 date the funds should clear. Defaults to the next business day.' },
              { name: 'reference', type: 'string', required: false, description: 'Remittance information shown on the beneficiary statement.' },
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
            endpoint moves money: without a key, a network timeout leaves you unable to tell whether
            the Payment was created, and a blind retry can pay the beneficiary twice. Generate one
            key per payment and reuse it on every attempt.
          </div>
          <p style={{ ...PROSE, fontSize: '14px' }}>
            <code style={INLINE_CODE}>payer_name</code> and{' '}
            <code style={INLINE_CODE}>payer_account</code> are derived from the debited Account and
            must not be sent. <code style={INLINE_CODE}>fee_amount</code> is quoted by the Custodian
            once the Payment is accepted, so it is null until the Payment reaches{' '}
            <code style={INLINE_CODE}>processing</code>.
          </p>
          <CodeTabs curl={CREATE_CURL} python={CREATE_PYTHON} javascript={CREATE_JS} />
          <FieldTable caption="Response fields: Payment object" fields={PAYMENT_FIELDS} />
          <ResponseBlock
            status={201}
            json={{
              ...PAYMENT,
              status: 'pending',
              fee_amount: null,
              created_at: '2026-06-10T08:20:00Z',
              updated_at: '2026-06-10T08:20:00Z',
            }}
          />
        </EndpointSection>

        {/* ── PATCH /payments/:id ── */}
        <EndpointSection
          id="update-payment"
          method="PATCH"
          path="/payments/{id}"
          title="Update payment"
          description="Updates the mutable fields of a Payment. Only a pending Payment can be changed."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Payment ID.' },
            ]}
          />
          <ParamTable
            caption="Request body"
            params={[
              { name: 'value_date', type: 'string', required: false, description: 'New ISO 8601 clearing date. Must be today or later.' },
              { name: 'reference', type: 'string', required: false, description: 'Updated remittance information.' },
              { name: 'fee_bearer', type: 'string', required: false, description: `Updated fee arrangement. One of: ${FEE_BEARERS}.` },
              { name: 'status', type: 'string', required: false, description: 'Set to cancelled to withdraw the instruction before it is sent to the Custodian.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            Amount, currency, beneficiary, and method are fixed once the Payment is initiated:
            changing them would make it a different instruction. Submit a new Payment instead.
            Updating a Payment that has left <code style={INLINE_CODE}>pending</code> returns{' '}
            <code style={INLINE_CODE}>409 conflict</code>.
          </p>
          <CodeTabs curl={UPDATE_CURL} python={UPDATE_PYTHON} javascript={UPDATE_JS} />
          <FieldTable caption="Response fields: Payment object" fields={PAYMENT_FIELDS} />
          <ResponseBlock
            status={200}
            json={{
              ...PAYMENT_LIST.data[1],
              value_date: '2026-06-15',
              reference: 'INV-2026-0442 custody fees Q2',
              updated_at: '2026-06-11T09:30:00Z',
            }}
          />
        </EndpointSection>

        {/* ── DELETE /payments/:id ── */}
        <EndpointSection
          id="remove-payment"
          method="DELETE"
          path="/payments/{id}"
          title="Remove payment"
          description="Deletes a Payment record. Only Payments with pending or failed status can be deleted."
        >
          <ParamTable
            caption="Path parameters"
            params={[
              { name: 'id', type: 'string', required: true, description: 'The unique Payment ID to delete.' },
            ]}
          />
          <p style={{ ...PROSE, fontSize: '14px' }}>
            A settled or returned Payment cannot be deleted and returns{' '}
            <code style={INLINE_CODE}>409 conflict</code>: cleared cash movements are part of the
            audit trail. Reverse one with a compensating Payment instead.
          </p>
          <CodeTabs curl={DELETE_CURL} python={DELETE_PYTHON} javascript={DELETE_JS} />
          <ResponseBlock status={204} json={null} />
        </EndpointSection>
      </ApiLayout>
    </Layout>
  );
}

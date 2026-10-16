/**
 * An evaluation suite for the documentation's AI agent, shown on two revisions.
 *
 * `main` is the current published documentation. `pr` is a proposed change that
 * tidies the Errors page and, without anyone noticing, removes two facts. The
 * suite is what notices.
 */

export const REVISIONS = {
  main: {label: 'main', note: 'Current published documentation'},
  pr: {label: 'PR #412', note: 'Tidy up the Errors page and shorten Conventions'},
};

export const CASES = [
  {
    id: 'EV-01',
    question: 'What is the maximum page size?',
    expected: '100',
    main: {status: 'pass', answer: 'The maximum page size is 100 records per request.', rationale: 'States the limit exactly as documented.'},
    pr:   {status: 'pass', answer: 'The maximum page size is 100 records per request.', rationale: 'Unchanged by this revision.'},
  },
  {
    id: 'EV-02',
    question: 'What should I do when I get a 429?',
    expected: 'Wait the number of seconds in the Retry-After header, then retry',
    main: {status: 'pass', answer: 'Wait the number of seconds given in the Retry-After header, then retry the request.', rationale: 'Names the header and the action.'},
    pr:   {status: 'fail', answer: 'Back off for a short period and try the request again.', rationale: 'Vague. The Retry-After header is no longer present in any retrieved chunk, so the agent substituted generic advice.', cause: 'The Retry-After sentence was removed from Errors › Rate limiting.'},
  },
  {
    id: 'EV-03',
    question: 'How do I stop a retry from creating a duplicate payment?',
    expected: 'Send an Idempotency-Key header, one key per payment, reused on retries',
    main: {status: 'pass', answer: 'Send an Idempotency-Key header. Generate one UUID per payment and reuse it on every retry.', rationale: 'Correct header, correct key lifetime.'},
    pr:   {status: 'pass', answer: 'Send an Idempotency-Key header. Generate one UUID per payment and reuse it on every retry.', rationale: 'Unchanged by this revision.'},
  },
  {
    id: 'EV-04',
    question: 'How long is an idempotency key kept?',
    expected: '24 hours',
    main: {status: 'pass', answer: 'Each Idempotency-Key is retained for 24 hours.', rationale: 'Exact value, correct unit.'},
    pr:   {status: 'fail', answer: 'Keys are retained for a limited period, after which the request is treated as new.', rationale: 'No number. The agent hedged because the retained chunk no longer carries the value.', cause: 'Conventions › Idempotency was shortened and lost the 24-hour figure.'},
  },
  {
    id: 'EV-05',
    question: 'Can I change the currency of an account later?',
    expected: 'No. Currency is fixed at creation; PATCH returns 422',
    main: {status: 'pass', answer: 'No. Type and currency are fixed at creation, and sending either returns 422 validation_failed.', rationale: 'Correct answer and correct error code.'},
    pr:   {status: 'pass', answer: 'No. Type and currency are fixed at creation, and sending either returns 422 validation_failed.', rationale: 'Unchanged by this revision.'},
  },
  {
    id: 'EV-06',
    question: 'What currency codes does the API accept?',
    expected: 'ISO 4217 three-letter codes in upper case',
    main: {status: 'pass', answer: 'Any ISO 4217 three-letter currency code in upper case, for example GBP, USD or EUR.', rationale: 'Names the standard and gives examples.'},
    pr:   {status: 'pass', answer: 'Any ISO 4217 three-letter currency code in upper case, for example GBP, USD or EUR.', rationale: 'Unchanged by this revision.'},
  },
  {
    id: 'EV-07',
    question: 'What is the rate limit on UAT?',
    expected: '120 requests per minute',
    main: {status: 'pass', answer: 'UAT allows 120 requests per minute. Production allows 600.', rationale: 'Both environments, both figures.'},
    pr:   {status: 'warn', answer: 'UAT has a lower rate limit than production.', rationale: 'True but useless. The comparison survived the edit; the numbers did not.', cause: 'Same edit as EV-02: figures were cut from Errors › Rate limiting.'},
  },
  {
    id: 'EV-08',
    question: 'Does a Transaction move money?',
    expected: 'No. A Transaction records intent; a Payment moves the cash',
    main: {status: 'pass', answer: 'No. A Transaction records the intent to move value; a Payment is the instruction that moves the cash.', rationale: 'Draws the distinction correctly.'},
    pr:   {status: 'pass', answer: 'No. A Transaction records the intent to move value; a Payment is the instruction that moves the cash.', rationale: 'Unchanged by this revision.'},
  },
];

export const STATUS = {
  pass: {label: 'pass', symbol: '✓'},
  warn: {label: 'weak', symbol: '!'},
  fail: {label: 'fail', symbol: '✗'},
};

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./pipelineSimulator.module.css";

/* ============================================================
   DZ Data Hub — Interactive Pipeline Simulator
   Docusaurus port: Tailwind utilities → pipelineSimulator.module.css,
   fonts loaded by the page (<Head>), no min-height:100vh — the
   component is now an embeddable block framed by the host page.
   ============================================================ */

// ---------- Design tokens (Darcula-inspired, JetBrains Mono) ----------
const T = {
  bg: "#1e1f22",
  panel: "#2b2d30",
  panelSoft: "#26282b",
  border: "#3c3f45",
  text: "#dfe1e5",
  dim: "#9da0a8",
  faint: "#6f7480",
  accent: "#4a9eff",      // selection / links
  run: "#f2b64c",         // running amber
  ok: "#63c76a",          // completed green
  code: "#bcbec4",
  kw: "#cf8e6d",          // code keywords (orange)
  str: "#6aab73",         // strings
  fn: "#56a8f5",          // functions / columns
  com: "#7a7e85",         // comments
};

// ---------- Sample data at each stage ----------
const RAW_ROWS = [
  { event_id: "evt_001", account: "acc_101", event_type: "TRIAL_STARTED", ts: "2026-06-01T09:14:22Z", _flag: null },
  { event_id: "evt_002", account: "acc_102", event_type: "trial_started", ts: "2026-06-02T11:03:40Z", _flag: "case" },
  { event_id: "evt_002", account: "acc_102", event_type: "trial_started", ts: "2026-06-02T11:03:40Z", _flag: "dup" },
  { event_id: "evt_003", account: "acc_999", event_type: "TRIAL_STARTED", ts: "2026-06-03T14:20:05Z", _flag: "test" },
  { event_id: "evt_004", account: "acc_101", event_type: "PAID_CONVERTED", ts: "2026-06-12T08:45:10Z", _flag: null },
];

const STG_ROWS = [
  { event_id: "evt_001", account_id: "acc_101", event_type: "trial_started", event_at: "2026-06-01 09:14:22" },
  { event_id: "evt_002", account_id: "acc_102", event_type: "trial_started", event_at: "2026-06-02 11:03:40" },
  { event_id: "evt_004", account_id: "acc_101", event_type: "paid_converted", event_at: "2026-06-12 08:45:10" },
];

const DIM_ROWS = [
  { account_id: "acc_101", plan: "Pro (trial)", region: "EU", is_test: "false" },
  { account_id: "acc_102", plan: "Team (trial)", region: "US", is_test: "false" },
  { account_id: "acc_999", plan: "Internal", region: "—", is_test: "true" },
];

const FCT_ROWS = [
  { event_id: "evt_001", account_id: "acc_101", event_type: "trial_started", plan: "Pro", region: "EU", event_date: "2026-06-01" },
  { event_id: "evt_002", account_id: "acc_102", event_type: "trial_started", plan: "Team", region: "US", event_date: "2026-06-02" },
  { event_id: "evt_004", account_id: "acc_101", event_type: "paid_converted", plan: "Pro", region: "EU", event_date: "2026-06-12" },
];

const METRIC_ROWS = [
  { month: "2026-06", trials_started: "2", paid_conversions: "1", trial_to_paid_rate: "50.0%" },
];

// ---------- Node catalog: docs + schema + code ----------
const NODES = {
  raw: {
    id: "raw",
    label: "raw.license_events",
    layer: "Ingestion · Airflow",
    x: 30, y: 96, w: 190,
    rows: RAW_ROWS,
    rowNote: "5 raw events. Note the duplicate, the lowercase type, and the internal test account.",
    overview: [
      ["Purpose", "Landing table for license lifecycle events streamed from the DZ billing system. Loaded as-is, with no cleaning or dedup: the raw layer is an audit trail, not a consumption surface."],
      ["Owner", "Data Platform team (@data-platform)"],
      ["Schedule", "Airflow DAG ingest_billing_events, hourly at :05. SLA: data available within 90 min of event time."],
      ["Freshness", "Monitored by an Airflow sensor; alerts to #data-alerts if the source API lags > 2h."],
      ["Downstream", "stg_license_events (dbt). Do not query this table for reporting; use the staging model instead."],
    ],
    schema: [
      ["event_id", "varchar", "Event identifier from billing. Not guaranteed unique at this layer (at-least-once delivery)."],
      ["account", "varchar", "Billing account reference. May include internal test accounts (acc_9xx)."],
      ["event_type", "varchar", "Free-form event name. Casing is inconsistent across billing service versions."],
      ["ts", "varchar", "Event timestamp as ISO-8601 string. Typed downstream, kept as text here."],
      ["_loaded_at", "timestamp", "Warehouse load time, set by the ingestion task."],
    ],
    codeLang: "python",
    codeTitle: "airflow/dags/ingest_billing_events.py",
    code: `"""Ingest license events from the DZ billing API into Snowflake.

Design notes for maintainers:
  * At-least-once delivery: the billing API may re-send events,
    so duplicates ARE expected in raw. Dedup happens in dbt
    (stg_license_events), never here.
  * Raw layer contract: land data unchanged. If you feel the urge
    to clean something in this DAG - resist, and open a PR against
    the staging model instead.
"""
from airflow.decorators import dag, task
from pendulum import datetime

@dag(
    schedule="5 * * * *",          # hourly at :05, see SLA in docs
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["billing", "ingestion"],
)
def ingest_billing_events():

    @task(retries=3, retry_delay=300)
    def extract(data_interval_start=None, data_interval_end=None):
        """Pull one hour of events from the billing API.

        Window boundaries come from Airflow's data interval, so
        a backfill re-runs cleanly for any historical hour.
        """
        return billing_client.fetch_events(
            since=data_interval_start,
            until=data_interval_end,
        )

    @task
    def load(events: list[dict]):
        # COPY into raw.license_events. Column mapping only -
        # no casts, no filters (see module docstring).
        snowflake.copy_into("raw.license_events", events)

    load(extract())

ingest_billing_events()`,
  },

  stg: {
    id: "stg",
    label: "stg_license_events",
    layer: "Staging · dbt",
    x: 300, y: 96, w: 195,
    rows: STG_ROWS,
    rowNote: "3 clean rows: evt_002 deduplicated, test account acc_999 filtered out, types normalized.",
    overview: [
      ["Purpose", "One clean, deduplicated row per license event. This is the trust boundary: everything downstream assumes staging contracts hold."],
      ["Owner", "Analytics Engineering (@analytics-eng)"],
      ["Grain", "One row per event_id."],
      ["Transformations", "Dedup by event_id (latest _loaded_at wins) · lowercase event_type · cast ts to timestamp · exclude internal test accounts."],
      ["Tests", "unique + not_null on event_id, accepted_values on event_type. Failures block the downstream DAG."],
    ],
    schema: [
      ["event_id", "varchar", "Unique event identifier (enforced by dbt test)."],
      ["account_id", "varchar", "Renamed from account for warehouse-wide consistency."],
      ["event_type", "varchar", "Normalized to lowercase snake_case: trial_started | paid_converted | trial_expired."],
      ["event_at", "timestamp", "Event time, cast from raw ISO string. UTC."],
    ],
    codeLang: "sql",
    codeTitle: "models/staging/stg_license_events.sql",
    code: `-- stg_license_events: one clean row per license event.
-- Grain: event_id. Contract enforced by dbt tests (see .yml).
--
-- Why dedup here and not in ingestion: the Airflow DAG lands the
-- API stream as-is (at-least-once delivery), so raw legitimately
-- contains duplicates. Staging is the single place they die.

with source as (

    select * from {{ source('billing', 'license_events') }}

),

deduplicated as (

    select
        *,
        -- Latest load wins: if billing re-sends an event with a
        -- correction, we keep the most recent copy.
        row_number() over (
            partition by event_id
            order by _loaded_at desc
        ) as rn
    from source

)

select
    event_id,
    account as account_id,            -- warehouse naming convention
    lower(event_type) as event_type,  -- billing v1 sent UPPERCASE
    cast(ts as timestamp) as event_at
from deduplicated
where rn = 1
  -- Internal test accounts (acc_9xx) generate synthetic events
  -- during release checks. They must never reach reporting.
  and account not like 'acc_9%'`,
  },

  dim: {
    id: "dim",
    label: "dim_accounts",
    layer: "Dimension · dbt",
    x: 300, y: 236, w: 195,
    rows: DIM_ROWS,
    rowNote: "Account attributes joined into the fact table: plan and region enable metric slicing.",
    overview: [
      ["Purpose", "Current-state account dimension: plan, region, lifecycle flags. Conformed dimension: every fact table joins to it the same way."],
      ["Owner", "Analytics Engineering (@analytics-eng)"],
      ["Grain", "One row per account_id (SCD type 1: attributes reflect current state)."],
      ["Source", "CRM export + billing plan table, merged nightly."],
      ["Note", "is_test mirrors the acc_9x convention so downstream models can filter consistently."],
    ],
    schema: [
      ["account_id", "varchar", "Primary key. Matches billing account reference."],
      ["plan", "varchar", "Current subscription plan at query time."],
      ["region", "varchar", "Sales region derived from billing country."],
      ["is_test", "boolean", "True for internal/test accounts. Filtered in staging, kept here for audits."],
    ],
    codeLang: "sql",
    codeTitle: "models/marts/dim_accounts.sql (excerpt)",
    code: `-- dim_accounts: conformed account dimension, current state (SCD1).
-- Grain: account_id.
--
-- Consumers: every fct_* model and most Metabase questions.
-- Breaking changes to this model require a deprecation notice
-- in #data-announcements (see the "Changing shared models" guide
-- in DZ Data Hub).

select
    a.account_id,
    p.plan_name        as plan,
    a.region,
    -- Test-account convention documented in the access guide:
    -- acc_9xx range is reserved for internal synthetic traffic.
    a.account_id like 'acc_9%' as is_test
from {{ ref('stg_crm_accounts') }} a
left join {{ ref('stg_billing_plans') }} p
    on p.account_id = a.account_id`,
  },

  fct: {
    id: "fct",
    label: "fct_license_events",
    layer: "Fact · dbt",
    x: 575, y: 166, w: 195,
    rows: FCT_ROWS,
    rowNote: "Events enriched with account attributes, ready for metric aggregation.",
    overview: [
      ["Purpose", "Analytics-ready fact table of license lifecycle events, enriched with account attributes. The documented source for all licensing metrics."],
      ["Owner", "Analytics Engineering (@analytics-eng); metric definitions co-owned with RevOps."],
      ["Grain", "One row per event_id."],
      ["Upstream", "stg_license_events, dim_accounts."],
      ["Downstream", "Metabase collection “Licensing”, incl. Trial-to-Paid Conversion Rate."],
    ],
    schema: [
      ["event_id", "varchar", "Unique event identifier (carried from staging)."],
      ["account_id", "varchar", "FK to dim_accounts."],
      ["event_type", "varchar", "trial_started | paid_converted | trial_expired."],
      ["plan", "varchar", "Denormalized from dim_accounts for query ergonomics."],
      ["region", "varchar", "Denormalized from dim_accounts."],
      ["event_date", "date", "Event date (UTC), used as the partition/cluster key."],
    ],
    codeLang: "sql",
    codeTitle: "models/marts/fct_license_events.sql",
    code: `-- fct_license_events: enriched license events, one row per event.
--
-- Denormalization note: plan and region are copied onto the fact
-- row on purpose. Analysts slice these constantly, and a stable
-- pre-joined column beats teaching every consumer the join. The
-- trade-off (attributes are "as of current state", SCD1) is
-- documented on the metric pages that depend on this model.

select
    e.event_id,
    e.account_id,
    e.event_type,
    a.plan,
    a.region,
    cast(e.event_at as date) as event_date
from {{ ref('stg_license_events') }} e
left join {{ ref('dim_accounts') }} a
    on a.account_id = e.account_id
-- No test-account filter here: staging already guarantees it.
-- Re-filtering downstream would hide a staging regression
-- instead of surfacing it in tests.`,
  },

  metric: {
    id: "metric",
    label: "Trial-to-Paid Rate",
    layer: "Metric · Metabase",
    x: 640, y: 306, w: 195,
    rows: METRIC_ROWS,
    rowNote: "June 2026: 2 trials started, 1 converted → 50.0%. Definition and caveats live on the metric page.",
    overview: [
      ["Definition", "Share of accounts that started a trial in a month and converted to a paid plan within 30 days of trial start."],
      ["Owner", "RevOps (business), Analytics Engineering (technical)."],
      ["Source", "fct_license_events is the only sanctioned source. Ad-hoc recalculations from raw are a known anti-pattern."],
      ["Caveats", "30-day conversion window means the latest month is incomplete until day 30. Plan/region reflect current account state (SCD1)."],
      ["Change log", "v1.2 (2026-05): window unified to 30 days across all dashboards; previously 14 days in the sales view."],
    ],
    schema: [
      ["month", "varchar", "Trial start month (UTC)."],
      ["trials_started", "int", "Distinct accounts with a trial_started event in the month."],
      ["paid_conversions", "int", "Of those, accounts with paid_converted within 30 days of trial start."],
      ["trial_to_paid_rate", "pct", "paid_conversions / trials_started."],
    ],
    codeLang: "sql",
    codeTitle: "Metabase question: Trial-to-Paid Conversion Rate",
    code: `-- Trial-to-Paid Conversion Rate (metric v1.2)
-- Canonical definition. Any dashboard showing this number must
-- point here - copies drift, references don't.

with trials as (

    select
        account_id,
        min(event_date) as trial_start_date
    from fct_license_events
    where event_type = 'trial_started'
    group by account_id

),

conversions as (

    select t.account_id, t.trial_start_date
    from trials t
    join fct_license_events e
      on e.account_id = t.account_id
     and e.event_type = 'paid_converted'
     -- 30-day window measured from trial start, not calendar
     -- month: a June 25 trial converting July 10 still counts
     -- toward June's rate.
     and e.event_date <= dateadd(day, 30, t.trial_start_date)

)

select
    to_char(t.trial_start_date, 'YYYY-MM')       as month,
    count(distinct t.account_id)                 as trials_started,
    count(distinct c.account_id)                 as paid_conversions,
    round(100.0 * count(distinct c.account_id)
        / nullif(count(distinct t.account_id), 0), 1)
                                                 as trial_to_paid_rate
from trials t
left join conversions c using (account_id)
group by 1
order by 1`,
  },
};

const NODE_H = 62;

// Edges with the stage at which their pulse animates
const EDGES = [
  { from: "raw", to: "stg", stage: 1 },
  { from: "stg", to: "fct", stage: 3 },
  { from: "dim", to: "fct", stage: 3 },
  { from: "fct", to: "metric", stage: 4 },
];

// Execution order: which node becomes active at each stage
const STAGE_NODE = ["raw", "stg", "dim", "fct", "metric"];
const STAGE_CAPTION = [
  "Ingesting raw events from the billing API (Airflow, hourly)…",
  "Staging: deduplicating, typing, filtering test accounts (dbt)…",
  "Loading the conformed account dimension (dbt, nightly)…",
  "Building the fact table: events × account attributes (dbt)…",
  "Aggregating the metric: Trial-to-Paid Conversion Rate (Metabase)…",
];

// ---------- Tiny syntax highlighter ----------
function highlight(code, lang) {
  const lines = code.split("\n");
  const kwRe =
    lang === "sql"
      ? /\b(select|from|where|with|as|join|left|right|on|and|or|not|like|group|order|by|over|partition|cast|case|when|then|else|end|min|max|count|distinct|round|lower|row_number|desc|asc|using|nullif|dateadd|to_char|null)\b/gi
      : /\b(def|from|import|return|class|None|True|False|list|dict|for|in|if|else|elif|with|as|lambda)\b/g;
  return lines.map((line, i) => {
    const cIdx = lang === "sql" ? line.indexOf("--") : line.indexOf("#");
    let codePart = line;
    let comment = null;
    // whole-line docstring lines (rough heuristic for the demo)
    const isDoc = lang === "python" && /^\s*("""|\*|Design|ingest|window|a back|so dup|\(stg_|to cle|the st)/.test(line) && /"""|^\s+\*|^\s+[A-Z(]/.test(line) === false;
    if (cIdx >= 0 && !(lang === "python" && line.trim().startsWith("#!"))) {
      codePart = line.slice(0, cIdx);
      comment = line.slice(cIdx);
    }
    // strings
    const tokens = [];
    let last = 0;
    const strRe = /('[^']*'|"[^"]*")/g;
    let m;
    while ((m = strRe.exec(codePart)) !== null) {
      if (m.index > last) tokens.push({ t: "code", v: codePart.slice(last, m.index) });
      tokens.push({ t: "str", v: m[0] });
      last = m.index + m[0].length;
    }
    if (last < codePart.length) tokens.push({ t: "code", v: codePart.slice(last) });

    return (
      <div key={i} style={{ display: "flex" }}>
        <span style={{ color: T.faint, width: 34, flexShrink: 0, textAlign: "right", paddingRight: 12, userSelect: "none" }}>{i + 1}</span>
        <span style={{ whiteSpace: "pre", color: isDoc ? T.com : T.code }}>
          {tokens.map((tok, j) =>
            tok.t === "str" ? (
              <span key={j} style={{ color: T.str }}>{tok.v}</span>
            ) : (
              <span key={j} dangerouslySetInnerHTML={{
                __html: tok.v
                  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                  .replace(kwRe, (w) => `<span style="color:${T.kw}">${w}</span>`),
              }} />
            )
          )}
          {comment && <span style={{ color: T.com, fontStyle: "italic" }}>{comment}</span>}
        </span>
      </div>
    );
  });
}

// ---------- Main component ----------
export default function PipelineSimulator() {
  const [selected, setSelected] = useState("stg");
  const [tab, setTab] = useState("overview");
  const [stage, setStage] = useState(-1);       // -1 idle, 0..4 running, 5 done
  const [running, setRunning] = useState(false);
  const [followRun, setFollowRun] = useState(true);
  const timer = useRef(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (timer.current) clearInterval(timer.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setStage(-1);
  }, [stop]);

  const run = useCallback(() => {
    if (stage >= 5) setStage(-1);
    setRunning(true);
  }, [stage]);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setStage((s) => {
        const next = s + 1;
        if (next >= 5) {
          setRunning(false);
          clearInterval(timer.current);
          return 5;
        }
        return next;
      });
    }, 1800);
    // kick off immediately from idle
    setStage((s) => (s < 0 ? 0 : s));
    return () => clearInterval(timer.current);
  }, [running]);

  // Follow the active node while running
  useEffect(() => {
    if (running && followRun && stage >= 0 && stage < 5) {
      setSelected(STAGE_NODE[stage]);
    }
  }, [stage, running, followRun]);

  const node = NODES[selected];
  const nodeState = (id) => {
    const idx = STAGE_NODE.indexOf(id);
    if (stage >= 5) return "done";
    if (stage < 0) return "idle";
    if (idx === stage && running) return "active";
    if (idx < stage || (idx === stage && !running)) return "done";
    return "idle";
  };

  const edgePath = (e) => {
    const a = NODES[e.from], b = NODES[e.to];
    const x1 = a.x + a.w, y1 = a.y + NODE_H / 2;
    const x2 = b.x, y2 = b.y + NODE_H / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  const btn = (label, onClick, opts = {}) => (
    <button
      onClick={onClick}
      disabled={opts.disabled}
      className={styles.btn}
      style={{
        background: opts.primary ? T.run : T.panel,
        color: opts.primary ? "#1e1f22" : T.text,
        border: `1px solid ${opts.primary ? T.run : T.border}`,
        // Only pin opacity when disabled — otherwise the :hover
        // rule in the CSS module can take effect (inline wins).
        ...(opts.disabled ? { opacity: 0.4 } : {}),
      }}
    >
      {label}
    </button>
  );

  return (
    <div className={styles.root} style={{ background: T.bg, color: T.text }}>
      {/* ---------- Header ---------- */}
      <div className={styles.header} style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className={styles.headerLead}>
          <div className={styles.kicker} style={{ color: T.dim }}>
            DZ Data Hub · interactive companion
          </div>
          <h2 className={styles.title}>License events pipeline: from billing API to metric</h2>
        </div>
        <div className={styles.controls}>
          {btn(running ? "Running…" : stage >= 5 ? "▶ Run again" : "▶ Run", run, { primary: true, disabled: running })}
          {btn("■ Stop", stop, { disabled: !running })}
          {btn("↺ Reset", reset, { disabled: stage < 0 })}
          <label className={styles.followLabel} style={{ color: T.dim }}>
            <input type="checkbox" checked={followRun} onChange={(e) => setFollowRun(e.target.checked)} />
            follow run
          </label>
        </div>
      </div>

      {/* ---------- Status line ---------- */}
      <div
        className={styles.status}
        style={{ background: T.panelSoft, borderBottom: `1px solid ${T.border}`, color: stage >= 0 && stage < 5 ? T.run : T.dim }}
      >
        {stage < 0 && "Idle. Press Run to simulate one pipeline execution, or click any node to read its documentation."}
        {stage >= 0 && stage < 5 && STAGE_CAPTION[stage]}
        {stage >= 5 && (
          <span style={{ color: T.ok }}>
            ✓ Pipeline complete. Trial-to-Paid Conversion Rate for 2026-06: <b>50.0%</b> (2 trials, 1 conversion). Click nodes to explore how the number was built.
          </span>
        )}
      </div>

      <div className={styles.main}>
        {/* ---------- DAG ---------- */}
        <div className={styles.dagPanel}>
          <svg viewBox="0 0 880 400" className={styles.svgFull}>
            {/* edges */}
            {EDGES.map((e, i) => {
              const active = running && stage === e.stage;
              const passed = stage > e.stage || stage >= 5;
              return (
                <g key={i}>
                  <path d={edgePath(e)} fill="none"
                    stroke={active ? T.run : passed ? T.ok : T.border}
                    strokeWidth={active ? 2.5 : 1.5} strokeDasharray={active ? "6 6" : "none"} />
                  {active && (
                    <circle r="5" fill={T.run}>
                      <animateMotion dur="0.9s" repeatCount="indefinite" path={edgePath(e)} />
                    </circle>
                  )}
                </g>
              );
            })}
            {/* nodes */}
            {Object.values(NODES).map((n) => {
              const st = nodeState(n.id);
              const isSel = selected === n.id;
              const stroke = st === "active" ? T.run : st === "done" ? T.ok : isSel ? T.accent : T.border;
              return (
                <g key={n.id} onClick={() => { setSelected(n.id); }} style={{ cursor: "pointer" }}>
                  <rect x={n.x} y={n.y} width={n.w} height={NODE_H} rx="8"
                    fill={isSel ? "#31343a" : T.panel}
                    stroke={stroke} strokeWidth={st === "active" || isSel ? 2 : 1.2}
                    className={st === "active" ? styles.pulse : undefined} />
                  <text x={n.x + 14} y={n.y + 26} fill={T.text} fontSize="14" fontWeight="600"
                    fontFamily="'JetBrains Mono', monospace">{n.label}</text>
                  <text x={n.x + 14} y={n.y + 46} fill={T.dim} fontSize="11.5">{n.layer}</text>
                  {st === "done" && (
                    <text x={n.x + n.w - 22} y={n.y + 24} fill={T.ok} fontSize="14">✓</text>
                  )}
                </g>
              );
            })}
            {/* legend */}
            <g fontSize="11" fill={T.faint}>
              <rect x="30" y="366" width="10" height="10" rx="2" fill="none" stroke={T.run} strokeWidth="1.5" />
              <text x="46" y="375">running</text>
              <rect x="110" y="366" width="10" height="10" rx="2" fill="none" stroke={T.ok} strokeWidth="1.5" />
              <text x="126" y="375">completed</text>
              <rect x="210" y="366" width="10" height="10" rx="2" fill="none" stroke={T.accent} strokeWidth="1.5" />
              <text x="226" y="375">selected: docs on the right</text>
            </g>
          </svg>

          {/* ---------- Data preview ---------- */}
          <div className={styles.dataCard} style={{ border: `1px solid ${T.border}` }}>
            <div className={styles.dataCardHeader} style={{ background: T.panelSoft, borderBottom: `1px solid ${T.border}` }}>
              <span className={styles.dataCardTitle}>
                Data at this stage · {node.label}
              </span>
              <span className={styles.dataCardNote} style={{ color: T.dim }}>{node.rowNote}</span>
            </div>
            <div className={styles.scrollX}>
              <table className={styles.dataTable}>
                <thead>
                  <tr style={{ background: T.panel }}>
                    {Object.keys(node.rows[0]).filter((k) => k !== "_flag").map((k) => (
                      <th key={k} className={styles.dataTh} style={{ color: T.fn, borderBottom: `1px solid ${T.border}` }}>{k}</th>
                    ))}
                    {node.id === "raw" && <th className={styles.dataTh} style={{ color: T.fn, borderBottom: `1px solid ${T.border}` }}>issue</th>}
                  </tr>
                </thead>
                <tbody>
                  {node.rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.panelSoft}`, opacity: r._flag === "dup" || r._flag === "test" ? 0.55 : 1 }}>
                      {Object.entries(r).filter(([k]) => k !== "_flag").map(([k, v]) => (
                        <td key={k} className={styles.dataTd} style={{ color: T.code }}>{v}</td>
                      ))}
                      {node.id === "raw" && (
                        <td className={styles.dataTd} style={{ color: r._flag ? T.run : T.faint }}>
                          {r._flag === "dup" ? "duplicate → dropped in stg" : r._flag === "case" ? "lowercase type → normalized" : r._flag === "test" ? "test account → filtered" : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---------- Docs panel ---------- */}
        <div className={styles.docsPanel}>
          <div className={styles.docsCard} style={{ border: `1px solid ${T.border}` }}>
            <div className={styles.docsCardHeader} style={{ background: T.panelSoft, borderBottom: `1px solid ${T.border}` }}>
              <div className={styles.docsLayer} style={{ color: T.faint }}>{node.layer}</div>
              <div className={styles.docsTitle}>{node.label}</div>
              <div className={styles.tabs}>
                {["overview", "schema", "code"].map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={styles.tab}
                    style={{
                      background: tab === t ? T.bg : "transparent",
                      color: tab === t ? T.text : T.dim,
                      borderBottom: tab === t ? `2px solid ${T.accent}` : "2px solid transparent",
                    }}>
                    {t === "overview" ? "Overview" : t === "schema" ? "Schema" : "Code"}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.docsBody} style={{ background: T.bg }}>
              {tab === "overview" && (
                <dl className={styles.overviewList}>
                  {node.overview.map(([k, v]) => (
                    <div key={k}>
                      <dt className={styles.overviewKey} style={{ color: T.accent }}>{k}</dt>
                      <dd className={styles.overviewVal} style={{ color: T.text }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {tab === "schema" && (
                <table className={styles.schemaTable}>
                  <thead>
                    <tr style={{ background: T.panel }}>
                      {["column", "type", "description"].map((h) => (
                        <th key={h} className={styles.schemaTh} style={{ color: T.faint, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {node.schema.map(([c, ty, d]) => (
                      <tr key={c} style={{ borderBottom: `1px solid ${T.panelSoft}` }}>
                        <td className={`${styles.schemaTd} ${styles.mono}`} style={{ color: T.fn }}>{c}</td>
                        <td className={`${styles.schemaTd} ${styles.schemaTdSmall} ${styles.mono}`} style={{ color: T.kw }}>{ty}</td>
                        <td className={`${styles.schemaTd} ${styles.schemaTdDesc}`} style={{ color: T.dim }}>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === "code" && (
                <div>
                  <div className={styles.codeHeader} style={{ background: T.panel, color: T.dim, borderBottom: `1px solid ${T.border}` }}>
                    {node.codeTitle}
                  </div>
                  <div className={styles.codeBody}>
                    {highlight(node.code, node.codeLang)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className={styles.footNote} style={{ color: T.faint }}>
            Every node carries three layers of documentation: an overview written for consumers,
            a schema contract, and the commented source itself. The simulation shows the same
            five events flowing through the system, including the duplicate, the inconsistent
            casing, and the test account that the pipeline is designed to handle.
          </p>
        </div>
      </div>
    </div>
  );
}

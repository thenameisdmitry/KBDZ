import React, {useState} from 'react';
import {CASES, REVISIONS, STATUS} from './cases';
import styles from './styles.module.css';

export default function RagEvalBench() {
  const [rev, setRev] = useState('main');
  const [open, setOpen] = useState(null);

  const rows = CASES.map((c) => ({...c, result: c[rev]}));
  const counts = rows.reduce(
    (acc, r) => ({...acc, [r.result.status]: (acc[r.result.status] || 0) + 1}),
    {},
  );
  const passing = counts.pass || 0;
  const gateFails = (counts.fail || 0) + (counts.warn || 0);

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.revs} role="group" aria-label="Revision under test">
          {Object.entries(REVISIONS).map(([id, r]) => (
            <button
              key={id}
              type="button"
              onClick={() => { setRev(id); setOpen(null); }}
              aria-pressed={rev === id}
              className={`${styles.revBtn} ${rev === id ? styles.revBtnActive : ''}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className={styles.revNote}>{REVISIONS[rev].note}</p>
      </div>

      <div className={`${styles.gate} ${gateFails ? styles.gateFail : styles.gatePass}`}>
        <strong className={styles.gateVerdict}>
          {gateFails ? 'CI gate: blocked' : 'CI gate: passed'}
        </strong>
        <span className={styles.gateCount}>
          {passing} of {rows.length} answers correct
          {gateFails > 0 && ` · ${gateFails} regression${gateFails > 1 ? 's' : ''} since main`}
        </span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.thStatus}>Status</th>
            <th scope="col">Question</th>
            <th scope="col" className={styles.thId}>Case</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const s = STATUS[r.result.status];
            const isOpen = open === r.id;
            return (
              <React.Fragment key={r.id}>
                <tr
                  className={`${styles.row} ${styles[`row_${r.result.status}`]}`}
                  onClick={() => setOpen(isOpen ? null : r.id)}
                >
                  <td className={styles.tdStatus}>
                    <span className={`${styles.badge} ${styles[`badge_${r.result.status}`]}`}>
                      {s.symbol} {s.label}
                    </span>
                  </td>
                  <td className={styles.tdQuestion}>
                    <button type="button" className={styles.rowBtn} aria-expanded={isOpen}>
                      {r.question}
                    </button>
                  </td>
                  <td className={styles.tdId}>{r.id}</td>
                </tr>
                {isOpen && (
                  <tr className={styles.detailRow}>
                    <td colSpan={3}>
                      <dl className={styles.detail}>
                        <dt>Expected</dt>
                        <dd>{r.expected}</dd>
                        <dt>Agent answered</dt>
                        <dd className={styles.answer}>{r.result.answer}</dd>
                        <dt>Judge</dt>
                        <dd>{r.result.rationale}</dd>
                        {r.result.cause && (
                          <>
                            <dt className={styles.causeKey}>Documentation cause</dt>
                            <dd className={styles.cause}>{r.result.cause}</dd>
                          </>
                        )}
                      </dl>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <footer className={styles.foot}>
        Select a row to see the expected answer, what the agent said, and the judge&rsquo;s
        reasoning. Switch to <strong>PR #412</strong> to watch a tidy-up edit remove two
        facts and fail the gate.
      </footer>
    </div>
  );
}

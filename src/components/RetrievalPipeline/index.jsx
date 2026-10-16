import React, {useEffect, useRef, useState} from 'react';
import {STAGES, QUESTION, OWNER_LABEL} from './stages';
import styles from './styles.module.css';

const STEP_MS = 1100;

export default function RetrievalPipeline() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);

  // Auto-advance while running, stopping at the last stage.
  useEffect(() => {
    if (!running) return undefined;
    if (active >= STAGES.length - 1) {
      setRunning(false);
      return undefined;
    }
    timer.current = setTimeout(() => setActive((i) => i + 1), STEP_MS);
    return () => clearTimeout(timer.current);
  }, [running, active]);

  const run = () => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Readers who asked for less motion get the end state immediately.
      setActive(STAGES.length - 1);
      return;
    }
    setActive(0);
    setRunning(true);
  };

  const stage = STAGES[active];

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div>
          <span className={styles.headLabel}>Question</span>
          <p className={styles.question}>{QUESTION}</p>
        </div>
        <button type="button" className={styles.run} onClick={run}>
          {running ? 'Running…' : 'Run the pipeline'}
        </button>
      </div>

      <ol className={styles.track}>
        {STAGES.map((s, i) => (
          <li key={s.id} className={styles.trackItem}>
            <button
              type="button"
              onClick={() => { setRunning(false); setActive(i); }}
              aria-current={i === active ? 'step' : undefined}
              className={[
                styles.node,
                i === active ? styles.nodeActive : '',
                i < active ? styles.nodeDone : '',
              ].join(' ')}
            >
              <span className={styles.nodeIndex}>{i + 1}</span>
              <span className={styles.nodeLabel}>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.panel}>
        <p className={styles.caption}>{stage.caption}</p>

        <dl className={styles.io}>
          {stage.io.map(([k, v]) => (
            <div key={k} className={styles.ioRow}>
              <dt className={styles.ioKey}>{k}</dt>
              <dd className={styles.ioVal}>{v}</dd>
            </div>
          ))}
        </dl>

        {stage.candidates && (
          <ul className={styles.candidates}>
            {stage.candidates.map((c) => (
              <li key={c.label} className={c.keep ? styles.candKeep : styles.candDrop}>
                <span className={styles.candScore}>{c.score.toFixed(2)}</span>
                <span className={styles.candLabel}>{c.label}</span>
                {c.moved === 'up' && <span className={styles.movedUp}>▲ promoted</span>}
                {c.moved === 'down' && <span className={styles.movedDown}>▼ demoted</span>}
                {!c.keep && <span className={styles.dropped}>dropped</span>}
              </li>
            ))}
          </ul>
        )}

        {stage.answer && (
          <blockquote className={styles.answer}>
            {stage.answer}
            <cite className={styles.cite}>{stage.citation}</cite>
          </blockquote>
        )}

        <p className={styles.detail}>{stage.detail}</p>

        <div className={styles.failure}>
          <span className={`${styles.owner} ${stage.owner === 'writer' ? styles.ownerWriter : styles.ownerShared}`}>
            {OWNER_LABEL[stage.owner]}
          </span>
          <p className={styles.failureText}>{stage.failure}</p>
        </div>
      </div>
    </div>
  );
}

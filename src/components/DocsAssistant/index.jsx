import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {buildIndex, search, composeAnswer, highlight} from './retrieval';
import CORPUS from './corpus.generated.json';
import {SCENARIOS} from './scenarios';
import styles from './styles.module.css';

const VERDICTS = {
  grounded: {label: 'Answer found in the guides', className: styles.verdictGood},
  partial: {label: 'Only partly supported', className: styles.verdictWarn},
  none: {label: 'Not answered by the guides', className: styles.verdictBad},
};

const SEARCH_MS = 2000;
const TYPE_MS = 16;
const CHARS_PER_TICK = 2;

const EMPTY = {verdict: 'none', coverage: 0, sentence: null, citation: null, matched: []};

function Highlighted({text, queryTerms}) {
  return highlight(text, queryTerms).map((part, i) =>
    part.hit ? <mark key={i} className={styles.hit}>{part.text}</mark> : <span key={i}>{part.text}</span>,
  );
}

export default function DocsAssistant() {
  const [tab, setTab] = useState(0);
  const [draft, setDraft] = useState(SCENARIOS[0].question);
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('idle'); // idle | searching | typing | done
  const [typed, setTyped] = useState(0);
  const [showWorkings, setShowWorkings] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  }, []);

  // One index over all five guides. No scoping: a customer-facing agent has none.
  const index = useMemo(() => buildIndex(CORPUS), []);

  const {results, queryTerms, answer} = useMemo(() => {
    if (!query) return {results: [], queryTerms: [], answer: EMPTY};
    const {results: r, queryTerms: q} = search(query, index);
    return {results: r, queryTerms: q, answer: composeAnswer(query, r, q)};
  }, [query, index]);

  const fullAnswer = answer.sentence || '';

  // Searching: hold for a beat so the reader sees retrieval happen.
  useEffect(() => {
    if (phase !== 'searching') return undefined;
    const t = setTimeout(() => setPhase('typing'), SEARCH_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Typing: reveal the answer the way an assistant streams one.
  useEffect(() => {
    if (phase !== 'typing') return undefined;
    if (!fullAnswer || typed >= fullAnswer.length) {
      setPhase('done');
      return undefined;
    }
    const t = setTimeout(
      () => setTyped((n) => Math.min(fullAnswer.length, n + CHARS_PER_TICK)),
      TYPE_MS,
    );
    return () => clearTimeout(t);
  }, [phase, typed, fullAnswer]);

  const reset = () => {
    setPhase('idle');
    setQuery('');
    setTyped(0);
    setShowWorkings(false);
  };

  const pickTab = (i) => {
    setTab(i);
    setDraft(SCENARIOS[i].question);
    reset();
  };

  const submit = (e) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q) return;
    setQuery(q);
    setTyped(0);
    setShowWorkings(false);
    setPhase(reduced ? 'done' : 'searching');
  };

  const top = results.slice(0, 3);
  const maxScore = top.length ? top[0].score : 0;
  const verdict = VERDICTS[answer.verdict];
  const topChunk = top[0]?.chunk;
  const shown = phase === 'done' ? fullAnswer : fullAnswer.slice(0, typed);
  const settled = phase === 'done';

  return (
    <div className={styles.root}>
      {/* ── The reader's situation ── */}
      <div className={styles.tabs} role="tablist" aria-label="Reader situation">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => pickTab(i)}
            className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`}
          >
            {s.tab}
          </button>
        ))}
      </div>

      <div className={styles.problemBox}>
        <span className={styles.problemLabel}>The situation</span>
        <p className={styles.problem}>{SCENARIOS[tab].problem}</p>
      </div>

      {/* ── What the reader types ── */}
      <form className={styles.ask} onSubmit={submit}>
        <label className={styles.askLabel} htmlFor="assistant-q">
          The question the reader types into the assistant
        </label>
        <div className={styles.askRow}>
          <input
            id="assistant-q"
            className={styles.input}
            value={draft}
            onChange={(e) => { setDraft(e.target.value); reset(); }}
            placeholder="Ask these guides a question"
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.searchBtn}
            disabled={phase === 'searching' || phase === 'typing'}
          >
            {phase === 'searching' ? 'Searching' : 'Search'}
          </button>
        </div>
        {phase === 'idle' && (
          <p className={styles.hint}>
            Press <strong>Search</strong> to run this question against the five guides.
          </p>
        )}
      </form>

      {/* ── Searching ── */}
      {phase === 'searching' && (
        <div className={styles.searching} role="status">
          <span className={styles.bar}><span className={styles.barFill} /></span>
          <span className={styles.searchingText}>
            Scoring {CORPUS.length} passages against the question
            <span className={styles.dots}><i>.</i><i>.</i><i>.</i></span>
          </span>
        </div>
      )}

      {/* ── The answer ── */}
      {(phase === 'typing' || phase === 'done') && (
        <section className={styles.answerBox} aria-label="Assistant answer" aria-live="polite">
          <div className={styles.answerHead}>
            <span className={styles.answerLabel}>The assistant answers</span>
            {settled && (
              <span className={`${styles.verdict} ${verdict.className}`}>{verdict.label}</span>
            )}
          </div>

          {fullAnswer ? (
            <>
              <blockquote className={styles.answer}>
                {shown}
                {!settled && <span className={styles.caret} aria-hidden="true" />}
              </blockquote>
              {settled && topChunk && (
                <p className={styles.citation}>
                  Source:{' '}
                  <Link to={`/docs/portfolio/${topChunk.slug}`}>{topChunk.doc}</Link>
                  {', '}{topChunk.heading}
                </p>
              )}
            </>
          ) : (
            <p className={styles.empty}>
              Nothing in the five guides answers this question. A generative assistant asked
              the same thing would be free to invent the missing detail.
            </p>
          )}
        </section>
      )}

      {/* ── The workings ── */}
      {settled && (
        <section className={styles.workings}>
          <button
            type="button"
            className={styles.workingsToggle}
            onClick={() => setShowWorkings((v) => !v)}
            aria-expanded={showWorkings}
          >
            <span className={styles.chev}>{showWorkings ? '▾' : '▸'}</span>
            How the assistant arrived at that answer
          </button>

          {showWorkings && (
            <div className={styles.workingsBody}>
              <dl className={styles.metrics}>
                <div>
                  <dt>Passages searched</dt>
                  <dd>{CORPUS.length}</dd>
                </div>
                <div>
                  <dt>Passages matched</dt>
                  <dd>{results.length}</dd>
                </div>
                <div>
                  <dt>Question terms found</dt>
                  <dd>{answer.matched.length} of {queryTerms.length}</dd>
                </div>
                <div>
                  <dt>Grounding</dt>
                  <dd>{Math.round(answer.coverage * 100)}%</dd>
                </div>
              </dl>

              <p className={styles.explain}>
                Each passage is scored with BM25: a term counts for more when it is rare
                across the corpus and appears often in one passage, and long passages are
                penalised so they cannot win on length alone. The highlighted words below
                are the question terms the passage actually contains.
              </p>

              {top.map((r, i) => (
                <article key={r.chunk.id} className={styles.chunk}>
                  <header className={styles.chunkHead}>
                    <span className={styles.rank}>#{i + 1}</span>
                    <span className={styles.source}>
                      {r.chunk.doc}, {r.chunk.heading}
                    </span>
                    <span className={styles.score}>{r.score.toFixed(2)}</span>
                  </header>
                  <span className={styles.scoreBar} aria-hidden="true">
                    <span
                      className={styles.scoreFill}
                      style={{width: `${maxScore ? Math.round((r.score / maxScore) * 100) : 0}%`}}
                    />
                  </span>
                  <p className={styles.chunkText}>
                    <Highlighted text={r.chunk.text} queryTerms={queryTerms} />
                  </p>
                </article>
              ))}

              <p className={styles.foot}>
                The answer is the sentence from the top passage carrying the most question
                terms. It is quoted, never generated, so the assistant cannot state a fact
                the guides do not contain.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

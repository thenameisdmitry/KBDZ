/**
 * A small, honest BM25 retriever. No embeddings, no API calls: everything runs
 * in the reader's browser so the artifact works on a static site.
 *
 * BM25 is lexical, so it rewards the same thing good retrieval writing rewards:
 * the answer's own words appearing in the chunk that holds the answer.
 */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'of', 'to', 'in', 'on', 'at', 'for',
  'is', 'are', 'was', 'were', 'be', 'been', 'it', 'its', 'this', 'that', 'these',
  'with', 'as', 'by', 'from', 'can', 'do', 'does', 'how', 'what', 'when', 'which',
  'i', 'you', 'my', 'me', 'we', 'they', 'should', 'would', 'will', 'get', 'got',
]);

/** Lower-case, strip punctuation, drop stopwords, and fold the simplest plurals. */
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);
}

function stem(token) {
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
}

const K1 = 1.5;
const B = 0.75;

/** Pre-compute document frequencies and lengths for one corpus variant. */
export function buildIndex(chunks) {
  const docs = chunks.map((chunk) => {
    // The heading is part of the retrievable text: it is the highest-signal
    // line in a chunk, which is exactly why heading wording matters so much.
    const tokens = tokenize(`${chunk.heading} ${chunk.text}`);
    const tf = new Map();
    tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    return {chunk, tokens, tf, length: tokens.length};
  });

  const df = new Map();
  docs.forEach((d) => {
    new Set(d.tokens).forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  });

  const avgLength = docs.reduce((sum, d) => sum + d.length, 0) / (docs.length || 1);
  return {docs, df, avgLength, size: docs.length};
}

function idf(term, index) {
  const n = index.size;
  const d = index.df.get(term) || 0;
  return Math.log(1 + (n - d + 0.5) / (d + 0.5));
}

/**
 * Score every chunk against the question and return them ranked.
 * `matched` lists which question terms the chunk actually contains, which is
 * what the grounding verdict is based on.
 */
export function search(question, index) {
  const queryTerms = [...new Set(tokenize(question))];
  if (queryTerms.length === 0) return {results: [], queryTerms};

  const results = index.docs
    .map((d) => {
      let score = 0;
      const matched = [];
      queryTerms.forEach((term) => {
        const tf = d.tf.get(term) || 0;
        if (tf === 0) return;
        matched.push(term);
        const norm = tf * (K1 + 1) /
          (tf + K1 * (1 - B + B * (d.length / index.avgLength)));
        score += idf(term, index) * norm;
      });
      return {chunk: d.chunk, score, matched};
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return {results, queryTerms};
}

/**
 * Compose an extractive answer from the top chunk: the single sentence with the
 * most question terms in it. Extractive rather than generated, so nothing on
 * this page can invent a fact that is not in the corpus.
 */
export function composeAnswer(question, results, queryTerms) {
  if (results.length === 0) {
    return {verdict: 'none', grounded: false, coverage: 0, sentence: null, citation: null, matched: []};
  }

  const top = results[0];
  const coverage = queryTerms.length ? top.matched.length / queryTerms.length : 0;

  const sentences = top.chunk.text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  let best = sentences[0] || top.chunk.text;
  let bestHits = -1;
  sentences.forEach((s) => {
    const tokens = new Set(tokenize(s));
    const hits = queryTerms.filter((t) => tokens.has(t)).length;
    if (hits > bestHits) {
      bestHits = hits;
      best = s;
    }
  });

  // Three states, not two. A chunk that matches half the question often yields a
  // fluent answer to a question it does not actually address, which is the most
  // common way a RAG answer goes wrong in production.
  let verdict = 'none';
  if (coverage >= 0.75) verdict = 'grounded';
  else if (coverage >= 0.4) verdict = 'partial';

  return {
    verdict,
    grounded: verdict === 'grounded',
    coverage,
    sentence: best,
    citation: `${top.chunk.source} › ${top.chunk.heading}`,
    matched: top.matched,
  };
}

/** Wrap matched query terms in <mark> so the reader can see why a chunk ranked. */
export function highlight(text, queryTerms) {
  if (!queryTerms.length) return [{text, hit: false}];
  const terms = new Set(queryTerms);
  return text.split(/(\s+)/).map((word) => {
    const bare = tokenize(word)[0];
    return {text: word, hit: Boolean(bare && terms.has(bare))};
  });
}

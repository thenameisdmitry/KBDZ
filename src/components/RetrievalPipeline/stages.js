/**
 * A scripted walk through one question as it travels a production RAG pipeline.
 * Every stage carries what it receives, what it emits, and the way it fails.
 *
 * The `owner` field is the point of the artifact: most of these failures are
 * fixed by the writer, not by the platform team.
 */

export const QUESTION = 'Can I change the currency of an account later?';

export const STAGES = [
  {
    id: 'query',
    label: 'Query',
    caption: 'The customer asks',
    io: [
      ['Input', 'Free text typed into a support widget'],
      ['Output', '"Can I change the currency of an account later?"'],
    ],
    detail:
      'Nothing is known yet about the product, the version or the customer’s plan. Anything the pipeline needs to disambiguate the question has to come from metadata or from the documentation itself.',
    failure:
      'The question uses the customer’s vocabulary, not yours. If your heading says "Immutable attributes" and the customer says "change the currency", the lexical stage has nothing to match.',
    owner: 'writer',
  },
  {
    id: 'chunk',
    label: 'Chunk',
    caption: 'Pages are split in advance',
    io: [
      ['Input', '12 documentation pages'],
      ['Output', '47 chunks, roughly 300 tokens each, split on headings'],
    ],
    detail:
      'Chunking happens at index time, long before the question arrives. A chunk keeps its heading and its metadata; it keeps nothing of the page around it.',
    failure:
      'A fact split across a chunk boundary is a fact nobody can retrieve. A value that only makes sense next to the paragraph above it loses that context permanently.',
    owner: 'writer',
  },
  {
    id: 'embed',
    label: 'Embed',
    caption: 'Question becomes a vector',
    io: [
      ['Input', '"Can I change the currency of an account later?"'],
      ['Output', '[0.021, -0.118, 0.307, …] over 1536 dimensions'],
    ],
    detail:
      'The question and every chunk are mapped into the same vector space, so that "change the currency" can match "currency is fixed at creation" without sharing a single word.',
    failure:
      'Embeddings blur distinctions that matter. Two near-identical pages for two product versions sit almost on top of each other in vector space, and the model has no way to prefer the right one.',
    owner: 'shared',
  },
  {
    id: 'retrieve',
    label: 'Retrieve',
    caption: 'Nearest chunks are pulled',
    io: [
      ['Input', 'Query vector + 47 chunk vectors'],
      ['Output', 'Top 8 candidates by cosine similarity'],
    ],
    candidates: [
      {label: 'Accounts › Creating an Account', score: 0.81, keep: true},
      {label: 'Accounts › Which fields can change', score: 0.78, keep: true},
      {label: 'Accounts › Overview', score: 0.64, keep: true},
      {label: 'Portfolios › Base currency', score: 0.52, keep: false},
    ],
    detail:
      'Similarity is not relevance. The creation page scores highest here because it talks about currency at length, even though the customer asked about changing one.',
    failure:
      'If the answer lives in a chunk that never mentions the customer’s words, it does not enter this list, and no later stage can rescue it.',
    owner: 'writer',
  },
  {
    id: 'rerank',
    label: 'Rerank',
    caption: 'Candidates are reordered',
    io: [
      ['Input', '8 candidates'],
      ['Output', '3 chunks, reordered by a cross-encoder'],
    ],
    candidates: [
      {label: 'Accounts › Which fields can change', score: 0.94, keep: true, moved: 'up'},
      {label: 'Accounts › Creating an Account', score: 0.61, keep: true, moved: 'down'},
      {label: 'Accounts › Overview', score: 0.40, keep: true},
    ],
    detail:
      'A reranker reads the question and each candidate together, so it can tell "how to set the currency" apart from "whether the currency can be changed". This is where a well-titled section wins.',
    failure:
      'A reranker can only reorder what retrieval handed it. It cannot add the chunk that was never written.',
    owner: 'shared',
  },
  {
    id: 'generate',
    label: 'Generate',
    caption: 'The model writes the reply',
    io: [
      ['Input', '3 chunks + the question'],
      ['Output', 'One paragraph of prose'],
    ],
    detail:
      'The model is instructed to answer only from the supplied chunks. Whether it can depends entirely on whether the answer is in them.',
    failure:
      'Asked a question the chunks do not cover, a model rarely refuses. It fills the gap with something that reads exactly like the rest of your documentation.',
    owner: 'writer',
  },
  {
    id: 'cite',
    label: 'Cite',
    caption: 'Sources are attached',
    io: [
      ['Input', 'Generated answer + chunk ids'],
      ['Output', 'Answer with links back to the source sections'],
    ],
    answer:
      'No. An Account’s type and currency are fixed when it is created. Sending either field to PATCH /accounts/{id} returns 422 validation_failed.',
    citation: 'Accounts › Which Account fields can be changed after creation',
    detail:
      'Citations are the only part of the answer a customer can verify, and the only part a writer can audit. They are also how an agent error becomes a documentation ticket.',
    failure:
      'A citation that points at a section which does not actually contain the claim is worse than no citation: it transfers your documentation’s authority to a sentence the model made up.',
    owner: 'writer',
  },
];

export const OWNER_LABEL = {
  writer: 'Fixed by the writer',
  shared: 'Shared with the platform team',
};

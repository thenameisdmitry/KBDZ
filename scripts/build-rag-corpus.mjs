/**
 * Builds the retrieval corpus for the Documentation Assistant from the
 * published portfolio guides.
 *
 * The point of generating rather than hand-writing it: the index is derived
 * from the same source the reader sees, so it cannot quietly drift from the
 * documentation. Re-run with `npm run gen-rag-corpus` after editing a guide.
 */
import fs from 'node:fs';
import path from 'node:path';

const SOURCES = [
  {file: 'Case-1-Algo-Recon.mdx',          doc: 'Case 1: Algorithmic Reconciliation', slug: 'Case-1-Algo-Recon'},
  {file: 'Case-2-Approver-App.mdx',        doc: 'Case 2: Approver Application',       slug: 'Case-2-Approver-App'},
  {file: 'Case-3-GL-Manager.mdx',          doc: 'Case 3: GL Manager',                 slug: 'Case-3-GL-Manager'},
  {file: 'Case-4-Optimizer.mdx',           doc: 'Case 4: Optimizer',                  slug: 'Case-4-Optimizer'},
  {file: 'Case-5-Transaction-Matching.mdx', doc: 'Case 5: Transaction Matching',      slug: 'Case-5-Transaction-Matching'},
];

const DOCS_DIR = path.join(process.cwd(), 'docs', 'portfolio');
const OUT = path.join(process.cwd(), 'src', 'components', 'DocsAssistant', 'corpus.generated.json');

const MAX_CHARS = 950;

/** Strip MDX machinery, keeping the prose a reader actually sees. */
function clean(raw) {
  let s = raw;

  s = s.replace(/^---\n[\s\S]*?\n---\n/, '');          // front matter
  s = s.replace(/^import .*$/gm, '');                   // imports
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');           // MDX comments

  // Glossary terms carry definitions worth retrieving: keep them as prose.
  s = s.replace(/<Term\s+name\s*=\s*["']([^"']+)["']\s*>([\s\S]*?)<\/Term>/g,
    (_m, name, body) => `\n${name}: ${body.trim()}\n`);

  // Worked examples are prose too.
  s = s.replace(/<Example\s+title\s*=\s*["']([^"']+)["']\s*>([\s\S]*?)<\/Example>/g,
    (_m, title, body) => `\n${title}. ${body.trim()}\n`);

  // Self-closing visual components contribute nothing retrievable.
  s = s.replace(/<(LightboxImage|ClickableSteps)[\s\S]*?\/>/g, '');
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');           // images
  s = s.replace(/<img[\s\S]*?\/>/g, '');

  // Styled layout wrappers: drop the tags, keep any text between them.
  s = s.replace(/<\/?div[^>]*>/g, '\n');
  s = s.replace(/<p style=\{\{[^}]*\}\}[^>]*>/g, '');
  s = s.replace(/<\/p>/g, '\n');
  s = s.replace(/<\/?(strong|em|span|small|br)[^>]*>/g, '');

  // Admonitions: keep the body, drop the fence and the shouty label.
  s = s.replace(/^:::[a-z]+(\[[^\]]*\])?\s*(.*)$/gm, (_m, _b, title) => (title ? `${title}.` : ''));
  s = s.replace(/^:::\s*$/gm, '');

  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');        // links to their text
  s = s.replace(/[*_`]/g, '');                          // emphasis marks
  s = s.replace(/\n{3,}/g, '\n\n');
  return s;
}

/** Split a document into chunks, one per heading, further split if long. */
function chunkDoc(text, source) {
  const lines = text.split('\n');
  const chunks = [];
  let heading = 'Introduction';
  let buffer = [];

  const flush = () => {
    const body = buffer.join(' ').replace(/\s+/g, ' ').trim();
    buffer = [];
    if (body.length < 60) return;                       // too thin to answer anything

    // Long sections become several chunks, split on sentence boundaries.
    const parts = [];
    let current = '';
    body.split(/(?<=\.)\s+/).forEach((sentence) => {
      if ((current + ' ' + sentence).length > MAX_CHARS && current) {
        parts.push(current.trim());
        current = sentence;
      } else {
        current += ` ${sentence}`;
      }
    });
    if (current.trim()) parts.push(current.trim());

    parts.forEach((part, i) => {
      chunks.push({
        id: `${source.slug}#${chunks.length}`,
        doc: source.doc,
        slug: source.slug,
        heading: parts.length > 1 ? `${heading} (${i + 1}/${parts.length})` : heading,
        anchor: heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        text: part,
      });
    });
  };

  lines.forEach((line) => {
    const h = line.match(/^#{2,4}\s+(.+?)\s*(\{#[^}]+\})?\s*$/);
    if (h) {
      flush();
      heading = h[1].trim();
    } else if (line.trim() && !line.startsWith('|---') && !line.startsWith('#')) {
      buffer.push(line.replace(/^\s*[-*]\s+/, '').replace(/^\s*\d+\.\s+/, ''));
    }
  });
  flush();
  return chunks;
}

const corpus = [];
SOURCES.forEach((source) => {
  const raw = fs.readFileSync(path.join(DOCS_DIR, source.file), 'utf8');
  const chunks = chunkDoc(clean(raw), source);
  corpus.push(...chunks);
  console.log(`${source.doc.padEnd(38)} ${String(chunks.length).padStart(3)} chunks`);
});

fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(corpus, null, 1));
console.log(`\n${corpus.length} chunks written to ${path.relative(process.cwd(), OUT)}`);

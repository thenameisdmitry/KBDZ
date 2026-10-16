import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Portfolio navigation.
 *
 * Four groups, each answering a different question a reader might have:
 * what I wrote, what I built, how I think about AI, and how I work.
 * Set `collapsed: true` on a category to fold it by default.
 *
 * The Emlid test assignment is deliberately absent: it is an unlisted page,
 * reachable only by direct link.
 */
const sidebars: SidebarsConfig = {
  portfolioSidebar: [
    'portfolio/portfolio-overview',

    {
      type: 'category',
      label: 'Product Documentation',
      collapsed: false,
      link: {type: 'doc', id: 'portfolio/guides'},
      items: [
        'portfolio/Case-1-Algo-Recon',
        'portfolio/Case-2-Approver-App',
        'portfolio/Case-3-GL-Manager',
        'portfolio/Case-4-Optimizer',
        'portfolio/Case-5-Transaction-Matching',
        'portfolio/releasenotes',
      ],
    },

    {
      type: 'category',
      label: 'Documentation Engineering',
      collapsed: false,
      items: [
        'portfolio/code-samples',
        'portfolio/dz-pipeline-simulator',
      ],
    },

    {
      type: 'category',
      label: 'AI & RAG',
      collapsed: false,
      items: [
        'portfolio/ai-retrieval',
        'portfolio/docs-assistant',
        'portfolio/retrieval-pipeline',
        'portfolio/rag-evaluation',
      ],
    },

    'portfolio/How-I-Work',
  ],
};

export default sidebars;

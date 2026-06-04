import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars = {
  portfolioSidebar: [
  {
    type: 'doc',
    id: 'portfolio-overview',
  },

  {
    type: 'category',
    label: 'Guides',
    collapsed: false,
    link: {
      type: 'doc',
      id: 'portfolio/guides',
    },
    items: [
      'portfolio/Case-1-Algo-Recon',
      'portfolio/Case-2-Approver-App',
      'portfolio/Case-3-GL-Manager',
      'portfolio/Case-4-Optimizer',
    ],
  },

  'kb-ui',
  'code-samples',
],
};

export default sidebars;

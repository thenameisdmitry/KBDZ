import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  portfolioSidebar: [
    {
      type: 'doc',
      id: 'portfolio/portfolio-overview',
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'portfolio/guides',
      },
      items: [
        'portfolio/Case-1-Algo-Recon',
        'portfolio/Case-2-Approver-App',
        'portfolio/Case-3-GL-Manager',
        'portfolio/Case-4-Optimizer',
        'portfolio/Case-5-Transaction-Matching',
      ],
    },
    'portfolio/releasenotes',
    'portfolio/code-samples',
    'portfolio/How-I-Work',
  ],

};

export default sidebars;
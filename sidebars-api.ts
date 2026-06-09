import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import apiSidebar from './docs/api/generated/sidebar';

const sidebars: SidebarsConfig = {
  apiSidebar: [
    {
      type: 'category',
      label: 'Transactions API',
      collapsed: false,
      items: apiSidebar,
    },
  ],
};

export default sidebars;
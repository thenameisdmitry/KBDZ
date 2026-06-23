import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Dmitrii Zhukov',
  tagline: 'Technical Writing | Product Documentation | Knowledge Management | Team Leadership | Fintech B2B SaaS | AI Workflow Optimization',
  favicon: 'img/Label.png',

  // Set the production url of your site here
  url: 'https://thenameisdmitry.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/KBDZ/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'thenameisdmitry', // Usually your GitHub org/user name.
  projectName: 'KBDZ', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          sidebarCollapsible: true,
          sidebarCollapsed: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          routeBasePath: 'articles',
          blogSidebarCount: 1,
          postsPerPage: 10,
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.png',
    colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
navbar: {
  title: 'Home',
  logo: {
    alt: 'Label',
    src: 'img/Label.png',
  },
  items: [
    {
      label: 'Portfolio',
      position: 'left',
      to: '/docs/portfolio/portfolio-overview',
    },
    {
      label: 'API Documentation',
      position: 'left',
      to: '/api',    
    },
   {
      label: 'My Blog',
      position: 'left',
      to: '/blog',
    },
    {
      label: 'My Expertise',
      position: 'left',
      to: '/expertise',
    },
    {
      href: 'https://github.com/thenameisdmitry/',
      label: 'DZ GitHub',
      position: 'right',
    },
  ],
},
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Dmitrii Zhukov. Powered with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

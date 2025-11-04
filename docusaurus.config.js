// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Leo ドキュメント',
  tagline: 'Aleo向けゼロ知識アプリのためのLeo言語ガイド',
  favicon: 'img/tab.png',

  // Set the production url of your site here
  url: 'https://example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'ProvableHQ',
  projectName: 'leo-docs-jp',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'documentation',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/HAaYAT0/leo-docs-jp/edit/master/',
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
        },
        blog: false,
        pages: {
          path: 'src/pages',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
      disableSwitch: true,
    },
    navbar: {
      title: 'Leo ドキュメント',
      logo: {
        alt: 'Leo ロゴ',
        src: 'img/icon.png',
        srcDark: 'img/icon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'ドキュメント',
        },
        {
          href: 'https://leo-lang.org',
          label: '公式サイト',
          position: 'right',
        },
        {
          href: 'https://github.com/HAaYAT0/leo-docs-jp',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'ガイド',
          items: [
            {
              label: 'はじめに',
              to: '/docs/installation',
            },
            {
              label: 'CLI',
              to: '/docs/cli_overview',
            },
            {
              label: 'Leo by Example',
              to: '/docs/auction',
            },
          ],
        },
        {
          title: 'コミュニティ',
          items: [
            {
              label: 'Aleo Discord',
              href: 'https://discord.com/invite/aleo',
            },
            {
              label: 'Aleo Explorer',
              href: 'https://explorer.provable.com',
            },
            {
              label: 'Provable SDK',
              href: 'https://provable.tools/',
            },
          ],
        },
        {
          title: 'リポジトリ',
          items: [
            {
              label: 'Leo Compiler',
              href: 'https://github.com/ProvableHQ/leo',
            },
            {
              label: 'ドキュメント原文',
              href: 'https://github.com/ProvableHQ/leo-docs-source',
            },
            {
              label: 'このリポジトリ',
              href: 'https://github.com/HAaYAT0/leo-docs-jp',
            },
          ],
        },
      ],
      // Removed footer copyright per request.
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['rust', 'toml', 'bash'],
    },
  },
};

module.exports = config;

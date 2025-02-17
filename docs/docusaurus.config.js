module.exports = {
  title: 'Moti',
  tagline:
    'The universal animation library for React Native, by Fernando Rojo.',
  url: 'https://moti.fyi',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'nandorojo',
  projectName: 'moti',
  scripts: [
    {
      src: 'https://cdn.splitbee.io/sb.js',
      async: true,
    },
    {
      src: 'https://snack.expo.dev/embed',
      async: true,
    },
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'by Fernando Rojo',
      logo: {
        alt: 'Moti Logo',
        src: 'img/logo-grad.svg',
      },
      items: [
        // {
        //   to: '/',
        //   activeBasePath: '/',
        //   label: 'Docs',
        //   position: 'left',
        // },
        {
          href: 'https://github.com/sponsors/nandorojo',
          label: 'Sponsor',
          position: 'right',
        },
        {
          href: 'https://discord.gg/JtvAVzNpDk',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://twitter.com/fernandotherojo',
          label: 'Twitter',
          position: 'right',
        },
        {
          href: 'https://github.com/nandorojo/moti',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    algolia: {
      apiKey: 'd527d7b164516f93e6a4b4bdfa1d71fe',
      indexName: 'moti',
      appId: '6P5W6OICQD',

      // Optional: see doc section bellow
      contextualSearch: true,

      // Optional: Algolia search parameters
      // searchParameters: {},

      //... other Algolia params
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/',
            },
            {
              label: 'Installation',
              to: '/installation',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/fernandotherojo',
            },
            {
              href: 'https://discord.gg/JtvAVzNpDk',
              label: 'Discord',
            },
            {
              href: 'https://github.com/sponsors/nandorojo',
              label: 'Sponsor',
            },
          ],
        },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'Blog',
        //       to: 'blog',
        //     },
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/facebook/docusaurus',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Fernando Rojo`,
    },
    twitterImage: 'https://moti.fyi/img/Banner%20Gradient.png',
    image: 'https://moti.fyi/img/Banner%20Gradient.png',
    ogImage: 'img/Banner Gradient.png',
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/nandorojo/moti/edit/master/docs',
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')], // thanks react-navigation!
          routeBasePath: '/', //disable landing page
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}

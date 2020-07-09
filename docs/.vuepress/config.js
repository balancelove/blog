module.exports = {
  theme: 'vdoing',
  title: '小烜同学',
  description: '天衣无缝的秘密是: 做技术，你快乐吗？',
  head: [['link', { rel: 'icon', href: '/avatar.jpg' }]],
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          const moment = require('moment');
          return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        },
      },
    ],
    [
      'vuepress-plugin-comment',
      {
        choosen: 'gitalk',
        options: {
          id: '<%- frontmatter.commentid || frontmatter.permalink %>',
          title: '「Comment」<%- frontmatter.title %>',
          body:
            '<%- frontmatter.title %>：<%-window.location.origin %><%- frontmatter.to.path || window.location.pathname %>',
          clientID: '9a042091f65631274241',
          clientSecret: '82b087e75d6f3f34c6d5ec718e5c78ea5cfccbf6',
          repo: 'blog',
          owner: 'balancelove',
          admin: ['balancelove'],
        },
      },
    ],
  ],
  themeConfig: {
    repo: 'balancelove/blog',
    logo: '/avatar.jpg',
    searchMaxSuggestions: 10,
    sidebarDepth: 2,
    lastUpdated: '上次更新',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '编辑',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端',
        link: '/web/',
        items: [
          {
            text: '前端文章',
            items: [
              { text: 'Vue 源码解析', link: '/pages/d5a9a7/' },
              { text: 'Redux 源码解析', link: '/pages/fa2e36/' },
            ],
          },
        ],
      },
      {
        text: '容器技术',
        link: '/docker/',
        items: [
          {
            text: 'Docker',
            link: '/pages/7c0943/',
          },
          {
            text: 'Kubernetes',
            link: '/pages/9de6e4/',
          },
        ],
      },
      {
        text: '技术',
        link: '/technology/',
        items: [
          {
            text: 'LeetCode 解题集',
            link: '/note/leetcode/',
          },
          {
            text: '技术杂谈',
            link: '/pages/888408/',
          },
        ],
      },
      {
        text: '小知识',
        link: '/tips/',
        items: [
          {
            text: 'Linux',
            link: '/pages/9927d1/',
          },
          {
            text: 'Npm',
            link: '/pages/46e82c/',
          },
          {
            text: 'Yarn',
            link: '/pages/47ba8c/',
          },
          {
            text: 'Docker',
            link: '/pages/a56550/',
          },
          {
            text: 'Git',
            link: '/pages/40acb9/',
          },
          {
            text: '云服务器',
            link: '/pages/ee9794/',
          },
          {
            text: 'Elasticsearch',
            link: '/pages/f26685/',
          },
          {
            text: 'Nginx',
            link: '/pages/3bc1c9/',
          },
          {
            text: 'CSS',
            link: '/pages/6437ec/',
          },
          {
            text: 'MongoDB',
            link: '/pages/87dc28/',
          },
        ],
      },
      {
        text: '更多',
        link: '/more/',
        items: [
          {
            text: '翻译文章',
            link: '/pages/f503c5/',
          },
          {
            text: '友情链接',
            link: '/friends/',
          },
        ],
      },
      {
        text: '资源收藏',
        link: '/collection/',
        items: [
          {
            text: '前端相关',
            link: '/pages/84d455/',
          },
          {
            text: 'Nginx',
            link: '/pages/ed481c/',
          },
        ],
      },
      { text: '关于', link: '/about/' },
      {
        text: '索引',
        link: '/archives/',
        items: [
          { text: '分类', link: '/categories/' },
          { text: '标签', link: '/tags/' },
          { text: '归档', link: '/archives/' },
        ],
      },
    ],
    smoothScroll: true,
    sidebar: 'structuring',
    blogger: {
      name: '小烜同学',
      slogan: '小学一年级的前端菜鸟',
      avatar: '/二维码.png',
    },
    author: {
      name: '小烜同学',
      link: 'https://github.com/balancelove',
    },
    social: {
      icons: [
        {
          iconClass: 'icon-youjian',
          title: '发邮件',
          link: 'balancelove@163.com',
        },
        {
          iconClass: 'icon-github',
          title: 'GitHub',
          link: 'https://github.com/balancelove',
        },
        {
          iconClass: 'icon-juejin',
          title: '掘金',
          link: 'https://juejin.im/user/59cbb8d46fb9a00a6c12c2cf',
        },
      ],
    },
    footer: {
      createYear: 2018,
      copyrightInfo: '小烜同学 | MIT Licensed',
    },
  },
};

const collection = require('./menu/collection');
const tips = require('./menu/tips');
const technology = require('./menu/technology');
const reading = require('./menu/reading');
const ask_and_answer = require('./menu/ask-and-answer');

const how_javascript_work = require('./menu/series/how_javascript_work');
const linux_shell = require('./menu/series/linux_shell');
const company_efficacy = require('./menu/series/company_efficacy');
const leetcode = require('./menu/series/leetcode');
const personal_op = require('./menu/series/personal_op');

module.exports = {
  title: '小烜同学',
  description: '天衣无缝的秘密是: 做技术，你快乐吗？',
  head: [
    ['link', { rel: 'icon', href: '/me.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  themeConfig: {
    repo: 'balancelove/blog',
    // text 为导航栏显示文字，link 为路径，即文件夹名字，注意不要丢了名字前后的'/'
    nav: [
      { text: '主页', link: '/' },
      { text: '每日一问', link: '/ask-and-answer/' },
      {
        text: '系列文章',
        items: [
          {
            text: '运维操作记录',
            link: '/series/personal_op/',
          },
          {
            text: 'JavaScript 如何工作',
            link: '/series/how_javascript_work/',
          },
          {
            text: '企业效能',
            link: '/series/company_efficacy/',
          },
          {
            text: 'LeetCode 解题集',
            link: '/series/leetcode/',
          },
        ],
      },
      {
        text: '技术文章',
        link: '/technology/',
      },
      {
        text: '读书汇',
        link: '/reading/',
      },
      {
        text: 'Tips',
        link: '/tips/',
      },
      {
        text: '资源收藏',
        link: '/collection/',
      },
      {
        text: '我的信息',
        items: [
          {
            text: '掘金',
            link: 'https://juejin.im/user/59cbb8d46fb9a00a6c12c2cf',
          },
          { text: 'Github', link: 'https://github.com/balancelove' },
        ],
      },
      {
        text: '友情链接',
        items: [
          {
            text: 'omyleon',
            link: 'http://omyleon.com/',
          },
          {
            text: 'godotdotdot',
            link: 'http://www.godotdotdot.com/',
          },
          {
            text: '举头三尺有神鱼',
            link: 'https://www.yvesx.com/',
          },
          {
            text: '创宇前端',
            link: 'https://knownsec-fed.com/',
          },
        ],
      },
    ],
    sidebar: {
      '/ask-and-answer/': ask_and_answer,
      '/reading/': reading,
      '/technology/': technology,
      '/tips/': tips,
      '/series/company_efficacy/': company_efficacy,
      '/series/how_javascript_work/': how_javascript_work,
      '/series/linux_shell/': linux_shell,
      '/series/personal_op/': personal_op,
      '/series/leetcode/': leetcode,
      '/collection/': collection,
    },
    // sidebarDepth: 0,
    lastUpdated: 'Last Updated',
    smoothScroll: true,
    // displayAllHeaders: true,
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-158660157-1',
      },
    ],
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
  ],
};

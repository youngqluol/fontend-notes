const sidebar = require('./sidebar')

module.exports = {
  // github action 部署，base的设置参考：https://www.vuepress.cn/guide/deploy.html#github-pages
  base: '/frontend-blogs/',
  title: 'youngqluol\'s blogs',
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }]
  ],
  // theme: 'reco', // TODO: 应用vuepress-theme-reco主题
  sidebarDepth: 2,
  themeConfig: {
    logo: '/logo.jpg',
    lastUpdated: 'Last Updated',
    sidebar: 'auto', // 侧边栏
    nav: [ // 右上角导航
      {
        text: 'JavaScript',
        link: '/pages/JavaScript/'
      },
      {
        text: 'HTML',
        link: '/pages/HTML/'
      },
      {
        text: 'Vue',
        link: '/pages/Vue/'
      }
    ]
  }
}
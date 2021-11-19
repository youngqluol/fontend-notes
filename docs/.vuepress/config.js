module.exports = {
  // github action 部署，base的设置参考：https://www.vuepress.cn/guide/deploy.html#github-pages
  base: '/frontend-blogs/',
  title: 'youngqluol\'s blogs',
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }]
  ],
  // theme: 'reco', // TODO: 应用vuepress-theme-reco主题，整个config需refactor
  sidebarDepth: 3,
  themeConfig: {
    logo: '/logo.jpg',
    lastUpdated: 'Last Updated',
    sidebar: 'auto', // 侧边栏
    nav: [ // 右上角导航
      {
        text: 'JavaScript',
        items: [
          {
            text: '基础及其他',
            link: '/pages/JavaScript/'
          },
          {
            text: 'node',
            link: '/pages/Node/'
          },
          {
            text: 'webpack',
            link: '/pages/webpack/'
          }
        ]
      },
      {
        text: 'HTML',
        link: '/pages/HTML/'
      },
      {
        text: 'Vue',
        link: '/pages/Vue/'
      },
      {
        text: '其他',
        items: [
          {
            text: '面试题',
            link: '/pages/other/questions/'
          },
          {
            text: '面试知识点',
            link: '/pages/other/interview/'
          },
          {
            text: 'HR面',
            link: '/pages/other/hr/'
          }
        ]
      }
    ]
  }
}
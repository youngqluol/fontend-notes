module.exports = {
  base: '/frontend-blogs/',
  title: 'youngqluol\'s blogs',
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }]
  ],
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
      }
    ]
  }
}
import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';

export default defineConfig({
  title: 'youngqluol\'s homepage',
  description: 'just some learning notes',
  head: [
    ['link', { rel: 'icon', href: '../logo.jpg' }]
  ],
  base: '/frontend-blogs/',
  srcDir: 'pages',
  // assetsDir: 'pages/public',
  lastUpdated: true,
  themeConfig: {
    logo: { src: '/logo.jpg', width: 24, height: 24 },
    sidebar: 'auto',
    nav: nav()
  },
})

function nav() {
  return [
      {
        text: 'javascript',
        items: [
          {
            text: 'javascript',
            link: '/javascript/',
          },
          {
            text: 'node',
            link: '/node/'
          },
          {
            text: 'webpack',
            link: '/webpack/'
          }
        ]
      },
      {
        text: 'html',
        link: '/html/'
      },
      {
        text: 'vue',
        link: '/vue/'
      },
      {
        text: '其他',
        items: [
          {
            text: '面试题',
            link: '/other/questions/'
          },
          {
            text: '面试知识点',
            link: '/other/interview/'
          },
          {
            text: 'hr',
            link: '/other/hr/'
          }
        ]
      }
    ]
}


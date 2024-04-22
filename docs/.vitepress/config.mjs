import {defineConfig} from 'vitepress'
import {nav} from './config/nav.js'
import {sidebar} from './config/sidebar.js'
import {head} from './config/head.js'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "create-neat",
  description: "🚀🚀🚀 基于 PN" +
    "PM 和 Turborepo 开发了前端脚手架，旨在为用户快速创建各种类型的项目。",
  base: '/',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  head,
  themeConfig: {
    nav,
    sidebar,
    // logo: '/logo.png',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    editLink: {
      pattern:
        'https://github.com/xun082/create-neat/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    lastUpdated: {
      text: '最近更新时间'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/xun082/create-neat'
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Moment'
    },
    search: {
      provider: 'local'
    },
  },
  sitemap: {
    hostname: ''
  },
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    }
  }
})

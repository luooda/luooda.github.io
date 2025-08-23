/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/', icon: 'mdi:home' },
  { text: '博客', link: '/blog/' ,icon: 'mdi:book-open-page-variant'},
  { text: '标签', link: '/blog/tags/' ,icon: 'mdi:tag'},
  { text: '归档', link: '/blog/archives/', icon: 'mdi:archive'},
  {text: '项目', link: '/project/', icon: 'mdi:folder'},
  {text: '生活', link: '/life/', icon: 'mdi:emoticon'},
  {text: '阅读', link: '/read/', icon: 'mdi:book'},
  {
    text: '笔记',
    items: [{ text: '示例', link: '/notes/demo/README.md' },
      { text: '设计模式', link: '/notes/design_pattern/README.md' },
    ],
    icon: 'mdi:file-document'
  },
  { text: '关于我', link: '/about/', icon: 'mdi:account'}
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  { text: 'Blog', link: '/en/blog/' },
  { text: 'Tags', link: '/en/blog/tags/' },
  { text: 'Archives', link: '/en/blog/archives/' },
  {
    text: 'Notes',
    items: [{ text: 'Demo', link: '/en/notes/demo/README.md' }]
  },
  
])


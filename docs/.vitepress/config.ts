import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI 编程教程',
  description: '系统学习 Skills、OpenSpec、Harness 等 AI 编程范式',
  lang: 'zh-CN',
  base: '/ohmyopenAI-tutorial-hub/',

  head: [
    ['link', { rel: 'icon', href: '/ohmyopenAI-tutorial-hub/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: 'AI 编程教程' }],
    ['meta', { property: 'og:description', content: '系统学习 Skills、OpenSpec、Harness 等 AI 编程范式' }],
    ['link', { rel: 'stylesheet', href: '/ohmyopenAI-tutorial-hub/custom.css' }],
  ],

  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    logo: '/ohmyopenAI-tutorial-hub/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: '参考', link: '/reference/', activeMatch: '/reference/' },
      { text: '示例', link: '/examples/', activeMatch: '/examples/' },
      {
        text: '语言',
        items: [
          { text: '简体中文', link: '/' },
          { text: 'English', link: '/en/' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          collapsed: false,
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/quickstart' },
          ]
        },
        {
          text: 'Skills 教程',
          collapsed: false,
          items: [
            { text: '什么是 Skill', link: '/guide/skills/what-is-skill' },
            { text: '创建你的第一个 Skill', link: '/guide/skills/first-skill' },
            { text: 'Skill 核心组件', link: '/guide/skills/components' },
            { text: '高级模式', link: '/guide/skills/advanced' },
            { text: '实战案例', link: '/guide/skills/practice' },
            { text: '最佳实践', link: '/guide/skills/best-practices' },
          ]
        },
        {
          text: 'OpenSpec 教程',
          collapsed: false,
          items: [
            { text: '核心概念', link: '/guide/openspec/concepts' },
            { text: '命令参考', link: '/guide/openspec/commands' },
            { text: '完整工作流', link: '/guide/openspec/workflow' },
            { text: '编写高质量 Spec', link: '/guide/openspec/writing-specs' },
            { text: '实战案例', link: '/guide/openspec/practice' },
            { text: '最佳实践', link: '/guide/openspec/best-practices' },
          ]
        },
        {
          text: 'Harness 教程',
          collapsed: false,
          items: [
            { text: '测试基础设施', link: '/guide/harness/intro' },
            { text: '编写测试场景', link: '/guide/harness/writing-tests' },
            { text: 'Evaluators', link: '/guide/harness/evaluators' },
            { text: 'Mock Server', link: '/guide/harness/mock-server' },
            { text: '实战案例', link: '/guide/harness/practice' },
            { text: '最佳实践', link: '/guide/harness/best-practices' },
          ]
        },
      ],
      '/reference/': [
        {
          text: '参考',
          items: [
            { text: '快速参考', link: '/reference/' },
            { text: '命令参考', link: '/reference/commands' },
            { text: 'FAQ', link: '/reference/faq' },
            { text: '故障排除', link: '/reference/troubleshooting' },
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例项目',
          items: [
            { text: '概述', link: '/examples/' },
            { text: '电商 MVP (Node.js)', link: '/examples/ecommerce-nodejs' },
            { text: '电商 MVP (Python)', link: '/examples/ecommerce-python' },
          ]
        }
      ],
      '/en/guide/': [
        {
          text: 'Get Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/en/guide/' },
            { text: 'Quick Start', link: '/en/guide/quickstart' },
          ]
        },
        {
          text: 'Skills Tutorial',
          collapsed: false,
          items: [
            { text: 'What is Skill', link: '/en/guide/skills/what-is-skill' },
            { text: 'Create Your First Skill', link: '/en/guide/skills/first-skill' },
            { text: 'Skill Components', link: '/en/guide/skills/components' },
            { text: 'Advanced Patterns', link: '/en/guide/skills/advanced' },
            { text: 'Practice', link: '/en/guide/skills/practice' },
            { text: 'Best Practices', link: '/en/guide/skills/best-practices' },
          ]
        },
        {
          text: 'OpenSpec Tutorial',
          collapsed: false,
          items: [
            { text: 'Core Concepts', link: '/en/guide/openspec/concepts' },
            { text: 'Commands', link: '/en/guide/openspec/commands' },
            { text: 'Workflow', link: '/en/guide/openspec/workflow' },
            { text: 'Writing Specs', link: '/en/guide/openspec/writing-specs' },
            { text: 'Practice', link: '/en/guide/openspec/practice' },
            { text: 'Best Practices', link: '/en/guide/openspec/best-practices' },
          ]
        },
        {
          text: 'Harness Tutorial',
          collapsed: false,
          items: [
            { text: 'Testing Infrastructure', link: '/en/guide/harness/intro' },
            { text: 'Writing Tests', link: '/en/guide/harness/writing-tests' },
            { text: 'Evaluators', link: '/en/guide/harness/evaluators' },
            { text: 'Mock Server', link: '/en/guide/harness/mock-server' },
            { text: 'Practice', link: '/en/guide/harness/practice' },
            { text: 'Best Practices', link: '/en/guide/harness/best-practices' },
          ]
        },
      ],
      '/en/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Quick Reference', link: '/en/reference/' },
            { text: 'Commands', link: '/en/reference/commands' },
            { text: 'FAQ', link: '/en/reference/faq' },
            { text: 'Troubleshooting', link: '/en/reference/troubleshooting' },
          ]
        }
      ],
      '/en/examples/': [
        {
          text: 'Example Projects',
          items: [
            { text: 'Overview', link: '/en/examples/' },
            { text: 'E-commerce MVP (Node.js)', link: '/en/examples/ecommerce-nodejs' },
            { text: 'E-commerce MVP (Python)', link: '/en/examples/ecommerce-python' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/strings77wzq/ohmyopenAI-tutorial-hub' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/strings77wzq/ai-tutorial-hub/edit/main/docs/:path'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2026 AI 编程教程'
    },
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        outline: {
          label: '本页目录'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        lastUpdated: {
          text: '最后更新于',
        },
        editLink: {
          text: '在 GitHub 上编辑此页'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        outline: {
          label: 'On this page'
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        lastUpdated: {
          text: 'Last updated',
        },
        editLink: {
          text: 'Edit this page on GitHub'
        }
      }
    }
  }
})

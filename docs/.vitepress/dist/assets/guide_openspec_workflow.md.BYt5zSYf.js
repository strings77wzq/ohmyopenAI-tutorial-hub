import{_ as a,o as n,c as i,ag as p}from"./chunks/framework.DbM0IBjv.js";const r=JSON.parse('{"title":"完整工作流","description":"","frontmatter":{},"headers":[],"relativePath":"guide/openspec/workflow.md","filePath":"guide/openspec/workflow.md","lastUpdated":1775571128000}'),l={name:"guide/openspec/workflow.md"};function e(t,s,h,k,d,o){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h1 id="完整工作流" tabindex="-1">完整工作流 <a class="header-anchor" href="#完整工作流" aria-label="Permalink to &quot;完整工作流&quot;">​</a></h1><p>通过实际案例，学习 OpenSpec 从提案到归档的完整工作流。</p><h2 id="案例-添加用户评论功能" tabindex="-1">案例：添加用户评论功能 <a class="header-anchor" href="#案例-添加用户评论功能" aria-label="Permalink to &quot;案例：添加用户评论功能&quot;">​</a></h2><h3 id="背景" tabindex="-1">背景 <a class="header-anchor" href="#背景" aria-label="Permalink to &quot;背景&quot;">​</a></h3><p>你正在开发一个博客系统，需要添加文章评论功能：</p><ul><li>用户可以发表评论</li><li>支持回复评论</li><li>需要分页显示</li><li>需要权限控制</li></ul><h3 id="step-1-创建提案" tabindex="-1">Step 1：创建提案 <a class="header-anchor" href="#step-1-创建提案" aria-label="Permalink to &quot;Step 1：创建提案&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:propose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;添加用户评论功能，支持发表评论、回复评论、分页显示&quot;</span></span></code></pre></div><p>AI 生成以下文档：</p><p><strong>proposal.md</strong></p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Why</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">用户反馈希望能对文章进行评论互动，增强社区活跃度。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## What</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">添加用户评论功能：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 用户可以对文章发表评论</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 支持回复其他评论（二级评论）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 评论列表分页显示（每页 20 条）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">4.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 支持删除自己的评论</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Capabilities</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 评论管理</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 评论显示</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Impact</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 文章模块</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 用户模块</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 数据库（新增 comment 表）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> API 接口</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Non-Goals</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不支持评论编辑（暂只支持删除重发）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不支持评论审核（后续迭代）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 不支持富文本（纯文本）</span></span></code></pre></div><p><strong>design.md</strong></p><p><strong>数据模型</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Comment</span></span>
<span class="line"><span>├── id: UUID</span></span>
<span class="line"><span>├── articleId: UUID (外键)</span></span>
<span class="line"><span>├── authorId: UUID (外键)</span></span>
<span class="line"><span>├── content: string (max 1000)</span></span>
<span class="line"><span>├── parentId: UUID? (外键，null 表示顶级评论)</span></span>
<span class="line"><span>├── createdAt: DateTime</span></span>
<span class="line"><span>└── deletedAt: DateTime?</span></span></code></pre></div><p><strong>API 设计</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>POST /api/v1/articles/{articleId}/comments</span></span>
<span class="line"><span>GET /api/v1/articles/{articleId}/comments?page={page}</span></span>
<span class="line"><span>DELETE /api/v1/comments/{commentId}</span></span></code></pre></div><p><strong>权限</strong></p><ul><li>任何人可以查看评论</li><li>登录用户可以发表评论</li><li>只能删除自己的评论</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>**specs/comment/spec.md**</span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## ADDED Requirements</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirement: 用户可以发表评论</span></span>
<span class="line"><span>用户 SHALL 能够对文章发表评论。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Scenario: 成功发表评论</span></span>
<span class="line"><span>- **GIVEN** 用户已登录</span></span>
<span class="line"><span>- **WHEN** 用户提交评论内容</span></span>
<span class="line"><span>- **THEN** 评论被保存</span></span>
<span class="line"><span>- **AND** 返回评论详情</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Scenario: 未登录用户发表评论</span></span>
<span class="line"><span>- **GIVEN** 用户未登录</span></span>
<span class="line"><span>- **WHEN** 用户提交评论内容</span></span>
<span class="line"><span>- **THEN** 返回 401 未授权错误</span></span></code></pre></div><p><strong>tasks.md</strong></p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 1. 数据库</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 1.1 创建 Comment 表</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 1.2 添加索引（articleId, createdAt）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 2. 后端 API</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 2.1 POST /api/v1/articles/{articleId}/comments</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 2.2 GET /api/v1/articles/{articleId}/comments</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 2.3 DELETE /api/v1/comments/{commentId}</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 2.4 编写单元测试</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 3. 前端</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 3.1 创建评论组件</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 3.2 集成到文章页面</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ ] 3.3 实现分页</span></span></code></pre></div><h3 id="step-2-审查确认" tabindex="-1">Step 2：审查确认 <a class="header-anchor" href="#step-2-审查确认" aria-label="Permalink to &quot;Step 2：审查确认&quot;">​</a></h3><p>你审查文档后，发现问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;design.md 里缺少分页的具体实现方案，需要说明：</span></span>
<span class="line"><span>1. 分页参数（page, limit）</span></span>
<span class="line"><span>2. 返回格式（列表 + 总数）</span></span>
<span class="line"><span>3. 排序规则（按时间倒序）&quot;</span></span></code></pre></div><p>AI 更新 design.md：</p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 分页设计</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 请求参数</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> page: number (default: 1)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> limit: number (default: 20, max: 100)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 响应格式</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`json</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;data&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 评论列表 */</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;meta&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;total&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;page&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;limit&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;totalPages&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="排序规则" tabindex="-1">排序规则 <a class="header-anchor" href="#排序规则" aria-label="Permalink to &quot;排序规则&quot;">​</a></h3><ul><li>顶级评论：按 createdAt 倒序</li><li>回复评论：按 createdAt 正序（显示在父评论下方）</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>### Step 3：开始实现</span></span>
<span class="line"><span></span></span>
<span class="line"><span>确认无误后：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`bash</span></span>
<span class="line"><span>/opsx:apply</span></span></code></pre></div><p>AI 开始执行任务：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>开始实现任务...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✓ 1.1 创建 Comment 表</span></span>
<span class="line"><span>  生成迁移文件: migrations/20250315_create_comment_table.sql</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✓ 1.2 添加索引</span></span>
<span class="line"><span>  创建复合索引: (articleId, createdAt)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>⟳ 2.1 POST /api/v1/articles/{articleId}/comments</span></span>
<span class="line"><span>  实现中...</span></span>
<span class="line"><span>  - 验证用户登录</span></span>
<span class="line"><span>  - 验证文章内容</span></span>
<span class="line"><span>  - 保存评论</span></span>
<span class="line"><span>  - 返回结果</span></span></code></pre></div><h3 id="step-4-调整规范" tabindex="-1">Step 4：调整规范 <a class="header-anchor" href="#step-4-调整规范" aria-label="Permalink to &quot;Step 4：调整规范&quot;">​</a></h3><p>实现到一半，你发现漏了一个需求：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;等等，我忘了考虑评论内容的长度限制和敏感词过滤。</span></span>
<span class="line"><span>需要在 specs/ 中添加这些需求。&quot;</span></span></code></pre></div><p>更新 spec.md：</p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### Requirement: 评论内容验证</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">系统 SHALL 验证评论内容的合法性。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">#### Scenario: 内容过长</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **WHEN**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 用户提交超过 1000 字的评论</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **THEN**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 返回 400 错误，提示&quot;评论内容不能超过 1000 字&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">#### Scenario: 包含敏感词</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **WHEN**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 用户提交包含敏感词的评论</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **THEN**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 返回 400 错误，提示&quot;评论内容包含敏感词&quot;</span></span></code></pre></div><p>让 AI 继续：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:apply</span></span></code></pre></div><p>AI 读取更新后的规范，添加验证逻辑。</p><h3 id="step-5-验证实现" tabindex="-1">Step 5：验证实现 <a class="header-anchor" href="#step-5-验证实现" aria-label="Permalink to &quot;Step 5：验证实现&quot;">​</a></h3><p>实现完成后：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:verify</span></span></code></pre></div><p>AI 验证结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>验证结果：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✓ 用户可以发表评论</span></span>
<span class="line"><span>✓ 支持回复评论</span></span>
<span class="line"><span>✓ 分页显示</span></span>
<span class="line"><span>✓ 内容长度验证</span></span>
<span class="line"><span>✓ 敏感词过滤</span></span>
<span class="line"><span>✓ 权限控制</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✗ 单元测试覆盖率不足（当前 60%，目标 80%）</span></span>
<span class="line"><span>  tasks.md 2.4 未完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>建议：补充单元测试后再归档</span></span></code></pre></div><h3 id="step-6-补充测试" tabindex="-1">Step 6：补充测试 <a class="header-anchor" href="#step-6-补充测试" aria-label="Permalink to &quot;Step 6：补充测试&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:apply</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> task</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2.4</span></span></code></pre></div><p>AI 补充单元测试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>✓ 添加 CommentController 单元测试</span></span>
<span class="line"><span>✓ 添加 CommentService 单元测试</span></span>
<span class="line"><span>✓ 添加权限验证测试</span></span>
<span class="line"><span>✓ 当前测试覆盖率：85%</span></span></code></pre></div><p>再次验证：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:verify</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>验证结果：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✓ 所有需求已实现</span></span>
<span class="line"><span>✓ 测试覆盖率 85%</span></span>
<span class="line"><span></span></span>
<span class="line"><span>可以归档！</span></span></code></pre></div><h3 id="step-7-归档" tabindex="-1">Step 7：归档 <a class="header-anchor" href="#step-7-归档" aria-label="Permalink to &quot;Step 7：归档&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:archive</span></span></code></pre></div><p>AI 执行归档：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>归档变更：</span></span>
<span class="line"><span>- 移动 openspec/changes/add-comment-feature/</span></span>
<span class="line"><span>- 到 openspec/archive/2025-03-16-add-comment-feature/</span></span>
<span class="line"><span>- 生成 summary.md</span></span>
<span class="line"><span></span></span>
<span class="line"><span>归档完成！</span></span></code></pre></div><p>生成的 <code>summary.md</code>：</p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;"># 变更摘要：添加用户评论功能</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 实现内容</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 用户评论功能（CRUD）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 支持二级评论（回复）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 分页显示（每页 20 条）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 内容验证（长度、敏感词）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 权限控制</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 技术方案</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 新增 Comment 表</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 3 个 API 接口</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> React 评论组件</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 单元测试覆盖率 85%</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 变更文件</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> migrations/20250315_create_comment_table.sql</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> src/controllers/CommentController.ts</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> src/services/CommentService.ts</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> src/components/CommentSection.tsx</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> tests/comment.test.ts</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 耗时</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 提案阶段：30 分钟</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 实现阶段：2 小时</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 总计：2.5 小时</span></span></code></pre></div><h2 id="时间线回顾" tabindex="-1">时间线回顾 <a class="header-anchor" href="#时间线回顾" aria-label="Permalink to &quot;时间线回顾&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>T+0:00  /opsx:propose &quot;添加用户评论功能&quot;</span></span>
<span class="line"><span>       AI 生成文档</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+0:30  人工审查，发现问题</span></span>
<span class="line"><span>       更新 design.md（分页方案）</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+0:45  /opsx:apply</span></span>
<span class="line"><span>       AI 开始实现</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+1:30  发现遗漏需求（内容验证）</span></span>
<span class="line"><span>       更新 spec.md</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+1:45  /opsx:apply</span></span>
<span class="line"><span>       AI 继续实现</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+2:30  /opsx:verify</span></span>
<span class="line"><span>       发现测试不足</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+2:45  /opsx:apply task 2.4</span></span>
<span class="line"><span>       补充测试</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+3:00  /opsx:verify</span></span>
<span class="line"><span>       全部通过</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>T+3:15  /opsx:archive</span></span>
<span class="line"><span>       归档完成</span></span></code></pre></div><h2 id="关键要点" tabindex="-1">关键要点 <a class="header-anchor" href="#关键要点" aria-label="Permalink to &quot;关键要点&quot;">​</a></h2><h3 id="_1-迭代调整是正常的" tabindex="-1">1. 迭代调整是正常的 <a class="header-anchor" href="#_1-迭代调整是正常的" aria-label="Permalink to &quot;1. 迭代调整是正常的&quot;">​</a></h3><p>不是一次就完美，发现遗漏及时更新规范。</p><h3 id="_2-规范是活的" tabindex="-1">2. 规范是活的 <a class="header-anchor" href="#_2-规范是活的" aria-label="Permalink to &quot;2. 规范是活的&quot;">​</a></h3><p>实现过程中可以修改 proposal、design、specs。</p><h3 id="_3-验证很重要" tabindex="-1">3. 验证很重要 <a class="header-anchor" href="#_3-验证很重要" aria-label="Permalink to &quot;3. 验证很重要&quot;">​</a></h3><p>/opsx:verify 确保实现符合规范。</p><h3 id="_4-归档沉淀知识" tabindex="-1">4. 归档沉淀知识 <a class="header-anchor" href="#_4-归档沉淀知识" aria-label="Permalink to &quot;4. 归档沉淀知识&quot;">​</a></h3><p>归档后的记录可供未来参考。</p><h2 id="常见流程变体" tabindex="-1">常见流程变体 <a class="header-anchor" href="#常见流程变体" aria-label="Permalink to &quot;常见流程变体&quot;">​</a></h2><h3 id="变体-1-简单功能" tabindex="-1">变体 1：简单功能 <a class="header-anchor" href="#变体-1-简单功能" aria-label="Permalink to &quot;变体 1：简单功能&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:propose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;修复登录按钮样式&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:apply</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:archive</span></span></code></pre></div><p>简单功能可以跳过复杂审查。</p><h3 id="变体-2-手动实现部分" tabindex="-1">变体 2：手动实现部分 <a class="header-anchor" href="#变体-2-手动实现部分" aria-label="Permalink to &quot;变体 2：手动实现部分&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:propose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;添加复杂算法&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:apply</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> from</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2.3</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # AI 只实现部分</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 手动实现核心算法</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:continue</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         # AI 继续剩余任务</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:archive</span></span></code></pre></div><h3 id="变体-3-分阶段实现" tabindex="-1">变体 3：分阶段实现 <a class="header-anchor" href="#变体-3-分阶段实现" aria-label="Permalink to &quot;变体 3：分阶段实现&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:propose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;添加支付功能&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:apply</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> phase</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 只实现第一阶段（基础功能）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 测试上线</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:apply</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> phase</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 实现第二阶段（高级功能）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/opsx:archive</span></span></code></pre></div><h2 id="下一步" tabindex="-1">下一步 <a class="header-anchor" href="#下一步" aria-label="Permalink to &quot;下一步&quot;">​</a></h2><p>学习如何编写高质量的规范：</p><p>→ <a href="/ohmyopenAI-tutorial-hub/guide/openspec/writing-specs">编写高质量 Spec</a></p>`,79)])])}const g=a(l,[["render",e]]);export{r as __pageData,g as default};

# 规格：SVG 图标设计标准

## 图标尺寸

- 标准尺寸：24x24px
- 描边宽度：2px
- viewBox：0 0 24 24

## 图标列表

### 首页 Features 图标

1. **bolt.svg** - 快速开始
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
   </svg>
   ```

2. **code.svg** - Skills
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
   </svg>
   ```

3. **document-text.svg** - OpenSpec
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
   </svg>
   ```

4. **beaker.svg** - Harness
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
   </svg>
   ```

5. **rocket.svg** - 实战项目
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16 8l2-2"/>
   </svg>
   ```

### 状态图标

6. **check-circle.svg** - 成功
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
   </svg>
   ```

7. **x-circle.svg** - 错误
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
   </svg>
   ```

8. **arrow-right.svg** - 链接
   ```svg
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
     <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
   </svg>
   ```

## CSS 样式规范

```css
.icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
}

.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-lg {
  width: 32px;
  height: 32px;
}

.icon-primary {
  color: var(--vp-c-brand-1);
}

.icon-success {
  color: var(--vp-c-green-1);
}

.icon-danger {
  color: var(--vp-c-red-1);
}
```

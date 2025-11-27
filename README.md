# 💒 张波 & 邓芮 婚礼网站

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)
![Three.js](https://img.shields.io/badge/Three.js-0.181.2-000000?style=for-the-badge&logo=three.js)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![GitHub](https://img.shields.io/badge/GitHub-YY--Nexus-181717?style=for-the-badge&logo=github)](https://github.com/YY-Nexus/zhang)

**现代 · 智能 · 沉浸式婚礼网站**

_诚挚邀请您参加张波与邓芮的婚礼，分享我们的幸福与喜悦！_

</div>

---

## 📖 项目简介

这是一个专为张波 & 邓芮婚礼打造的现代化、智能化的婚礼网站。项目采用 Next.js 16 + React 19 构建，融合了 3D 交互、实时通信、AI 智能助手等前沿技术，为来宾提供沉浸式的婚礼体验。

### ✨ 核心特色

- 🎨 **3D 无框画廊** - 基于 Three.js 的沉浸式照片展示
- 🎵 **智能音乐播放器** - 20 首中文婚礼曲目，支持投票与分段播放
- 💬 **实时留言墙** - WebSocket 实时通信，来宾互动
- 🤖 **AI 智能助手** - 浮动 AI 按钮，提供婚礼流程引导
- 📱 **响应式设计** - 完美适配移动端与桌面端
- ♿ **无障碍支持** - 完整的 ARIA 标签与键盘导航
- 🎭 **流畅动效** - Framer Motion 驱动的优雅动画

---

## 🚀 功能特性

### 🎯 核心功能模块

| 模块           | 功能描述                      | 状态      |
| -------------- | ----------------------------- | --------- |
| **Hero 区**    | 3D 无框画廊、倒计时、欢迎语   | ✅ 已完成 |
| **关于我们**   | 新人介绍、联系方式、爱情宣言  | ✅ 已完成 |
| **日程地点**   | 婚礼日程、地图导航、一键呼叫  | ✅ 已完成 |
| **照片画廊**   | 分类筛选、点赞评论、关联音乐  | ✅ 已完成 |
| **互动留言**   | 实时留言墙、WebSocket 通信    | ✅ 已完成 |
| **RSVP 表单**  | 出席确认、餐饮偏好、人数统计  | ✅ 已完成 |
| **音乐播放器** | 20 首曲目、投票系统、分段播放 | ✅ 已完成 |
| **AI 助手**    | 智能对话、流程引导、快捷操作  | ✅ 已完成 |

### 🎨 设计系统

- **配色方案**：暖金色 (#D4AF37) + 石墨灰 (#2C2C2C)
- **动效规范**：8+ 种标准动画，支持降级策略
- **响应式**：移动优先设计，触控友好
- **无障碍**：完整的 ARIA 支持，键盘导航

---

## 🛠️ 技术栈

### 前端框架

- **Next.js 16.0.3** - React 全栈框架
- **React 19.2.0** - UI 库
- **TypeScript 5.0** - 类型安全

### UI 与样式

- **Tailwind CSS 4.1.9** - 实用优先的 CSS 框架
- **Radix UI** - 无障碍组件库
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 3D 渲染

- **Three.js 0.181.2** - 3D 图形库
- **@react-three/fiber** - React Three.js 渲染器
- **@react-three/drei** - Three.js 辅助工具

### 表单与验证

- **React Hook Form** - 表单管理
- **Zod** - Schema 验证
- **@hookform/resolvers** - 表单解析器

### 实时通信

- **WebSocket** - 实时消息传递
- **降级轮询方案** - 兼容性保障

### 工具库

- **date-fns** - 日期处理
- **clsx** - 条件类名
- **tailwind-merge** - Tailwind 类名合并

---

## 📦 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (推荐) 或 npm >= 9.0.0

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/YY-Nexus/zhang.git
cd zhang
```

2. **安装依赖**

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

3. **启动开发服务器**

```bash
pnpm dev
# 或
npm run dev
```

4. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 其他命令

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

---

## 📁 项目结构

```text
zhang/
├── app/                      # Next.js App Router
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
│
├── components/              # React 组件
│   ├── ui/                  # 基础 UI 组件
│   └── wedding/             # 婚礼相关组件
│       ├── hero-section.tsx           # Hero 区
│       ├── countdown-section.tsx     # 倒计时
│       ├── about-section.tsx         # 关于我们
│       ├── schedule-section.tsx      # 日程地点
│       ├── gallery-section.tsx       # 照片画廊
│       ├── interaction-section.tsx   # 互动留言
│       ├── guest-sign-in.tsx         # 来宾签到
│       ├── floating-ai-button.tsx    # AI 助手
│       ├── music-player.tsx          # 音乐播放器
│       ├── draggable-modal.tsx       # 可拖拽弹窗
│       ├── footer.tsx                # 页脚
│       └── modal-contents/           # 弹窗内容组件
│
├── lib/                     # 工具库
│   ├── music-playlist.ts           # 音乐曲目清单
│   ├── music-player-api.ts         # 播放器 API
│   ├── websocket-client.ts         # WebSocket 客户端
│   ├── websocket-architecture.ts  # 实时服务架构
│   ├── ai-chat-templates.ts        # AI 对话模板
│   ├── wedding-copywriting.ts      # 婚礼文案
│   ├── animation-system.ts         # 动效系统
│   ├── design-tokens.ts            # 设计令牌
│   ├── qa-test-cases.ts            # 测试用例
│   └── utils.ts                    # 工具函数
│
├── public/                  # 静态资源
│   └── Wedding Photos/     # 婚礼照片
│
├── docs/                   # 项目文档
│   ├── zhang.md                    # 新人信息
│   ├── UI提示词.md                 # UI 设计提示词
│   ├── draggable-modal-spec.ts    # 弹窗组件规范
│   └── task-completion-summary.md  # 任务完成报告
│
├── styles/                  # 样式文件
├── next.config.mjs          # Next.js 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖
```

---

## 🎯 开发指南

### 代码规范

- 使用 **TypeScript** 进行类型安全开发
- 遵循 **ESLint** 代码规范
- 组件采用 **函数式组件** + **Hooks**
- 样式使用 **Tailwind CSS** 实用类

### 组件开发

1. **创建新组件**

```typescript
// components/wedding/new-component.tsx
'use client'

import { motion } from 'framer-motion'

export default function NewComponent() {
  return <section className="py-20">{/* 组件内容 */}</section>
}
```

2. **使用设计令牌**

```typescript
import { designTokens } from '@/lib/design-tokens'

// 使用预定义的颜色、间距等
```

3. **添加动画**

```typescript
import { animations } from '@/lib/animation-system'

// 使用标准动画预设
```

### 环境变量

创建 `.env.local` 文件（如需要）：

```env
# WebSocket 服务器地址
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com

# API 端点
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 🚢 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

### 手动构建

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 测试

项目包含完整的测试用例文档（`lib/qa-test-cases.ts`），涵盖：

- ✅ 弹窗拖拽边界约束测试
- ✅ 音乐投票并发处理测试
- ✅ 响应式布局测试
- ✅ 无障碍功能测试
- ✅ WebSocket 实时通信测试

运行测试：

```bash
# 查看测试用例
cat lib/qa-test-cases.ts
```

---

## 📝 文档

- [新人信息](./docs/zhang.md) - 婚礼基本信息
- [UI 设计提示词](./docs/UI提示词.md) - UI 设计规范
- [弹窗组件规范](./docs/draggable-modal-spec.ts) - 弹窗组件 API
- [任务完成报告](./docs/task-completion-summary.md) - 开发进度

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

---

## 👥 联系方式

- **项目维护者**：YY-Nexus
- **邮箱**：[admin@0379.email](mailto:admin@0379.email)
- **GitHub**：[https://github.com/YY-Nexus/zhang](https://github.com/YY-Nexus/zhang)

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 优秀的 React 框架
- [Three.js](https://threejs.org/) - 强大的 3D 库
- [Radix UI](https://www.radix-ui.com/) - 无障碍组件库
- [Framer Motion](https://www.framer.com/motion/) - 流畅的动画库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

---

<div align="center">

**💒 张波 & 邓芮 婚礼网站**

_2025 年 11 月 29 日 · 洛阳孟津富豪大酒店_

Made with ❤️ by YY-Nexus

</div>

# 智糖管家AI平台 (SugarSmart AI Platform)

> 糖尿病营养管理应用 - Monorepo架构

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8.15-orange)](https://pnpm.io/)

## 📋 项目概述

智糖管家AI是一款专为糖尿病患者设计的智能营养管理应用,通过AI技术提供个性化的饮食计划和健康管理建议。

### 核心功能

- 🍽️ **AI饮食计划** - 基于用户档案生成个性化低GI饮食方案
- 📊 **血糖追踪** - 记录和分析血糖变化趋势
- 📈 **健康报告** - AI生成每周健康分析报告
- 💊 **用药提醒** - 智能用药记录和提醒功能
- 📱 **多平台支持** - Web、Android、iOS全平台覆盖

## 🏗️ Monorepo架构

本项目采用pnpm workspaces + Turborepo进行管理:

```
sugarsmart-platform/
├── packages/
│   ├── web/          # Web端 (React + Vite)
│   ├── mobile/       # 移动端 (Capacitor打包)
│   ├── backend/      # 后端API (Node.js + Express)
│   └── shared/       # 共享代码 (types, utils, api-client)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### 包说明

| 包名 | 描述 | 技术栈 |
|------|------|--------|
| `@sugarsmart/web` | Web应用 | React 19.2 + Vite + Tailwind CSS |
| `@sugarsmart/mobile` | 移动应用 | Web代码 + Capacitor (生成APK/IPA) |
| `@sugarsmart/backend` | 后端服务 | Node.js + Express + TypeScript |
| `@sugarsmart/shared` | 共享库 | TypeScript types, utils, API client |

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- (可选) Android Studio - 用于Android打包
- (可选) Xcode - 用于iOS打包(需要Mac)

### 安装依赖

```bash
# 安装pnpm (如果还没有)
npm install -g pnpm

# 安装所有依赖
pnpm install
```

### 开发模式

```bash
# 启动Web端开发服务器
pnpm web:dev

# 启动Mobile端开发服务器
pnpm mobile:dev

# 启动Backend开发服务器
pnpm backend:dev

# 构建shared包
pnpm shared:build
```

### 生产构建

```bash
# 构建所有包
pnpm build:all

# 单独构建
pnpm web:build
pnpm mobile:build
pnpm backend:build
```

## 📱 移动端打包 (APK/IPA)

### Android打包流程

1. **首次配置Capacitor**
```bash
cd packages/mobile
pnpm cap:init
pnpm cap:add:android
```

2. **同步代码并打开Android Studio**
```bash
pnpm mobile:build        # 构建web资源
pnpm mobile:sync         # 同步到Android项目
pnpm cap:open:android    # 打开Android Studio
```

3. **在Android Studio中生成APK**
   - Build → Generate Signed Bundle/APK
   - 选择APK
   - 配置签名密钥
   - 生成release APK

### iOS打包流程 (需要Mac)

1. **配置Capacitor**
```bash
cd packages/mobile
pnpm cap:add:ios
```

2. **打开Xcode并打包**
```bash
pnpm mobile:build
pnpm mobile:sync
pnpm cap:open:ios
```

3. **在Xcode中**
   - 配置证书和Provisioning Profile
   - Product → Archive
   - 上传到App Store或导出IPA

## 🔧 开发指南

### 代码共享示例

**在web/mobile中使用shared包:**

```typescript
// packages/web/src/App.tsx
import { UserProfile, calculateBMI } from '@sugarsmart/shared';

const profile: UserProfile = {
  age: 45,
  height: 170,
  weight: 70,
  // ...
};

const bmi = calculateBMI(profile.height, profile.weight);
```

**在backend中使用shared类型:**

```typescript
// packages/backend/src/routes/user.ts
import { UserProfile } from '@sugarsmart/shared';

app.post('/api/users', (req, res) => {
  const profile: UserProfile = req.body;
  // 类型安全!
});
```

### 添加新依赖

```bash
# 给web包添加依赖
pnpm --filter @sugarsmart/web add axios

# 给所有包添加开发依赖
pnpm add -D -w prettier
```

### Git工作流

```bash
# 提交规范
git commit -m "feat(web): 添加血糖追踪图表"
git commit -m "fix(mobile): 修复Android返回按钮问题"
git commit -m "refactor(shared): 重构热量计算函数"
```

## 📚 技术文档

### Web端

- **UI框架**: React 19.2 with Hooks
- **路由**: React Router v7
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **AI**: Google Gemini API

### Mobile端

- **打包工具**: Capacitor 6.0
- **核心**: 复用Web端代码
- **原生功能**: 
  - 相机访问
  - 推送通知
  - 本地存储
  - 生物识别

### Backend端

- **框架**: Express.js
- **数据库**: (待实现) PostgreSQL + Prisma
- **认证**: (待实现) JWT
- **文件上传**: (待实现) Multer

### Shared包

```
packages/shared/src/
├── types/              # TypeScript接口定义
│   └── index.ts
├── utils/              # 工具函数
│   └── calorieCalculator.ts
├── api/                # API客户端(待实现)
│   └── client.ts
└── index.ts            # 统一导出
```

## 🗺️ 路线图

### ✅ 已完成 (v1.0)

- [x] Monorepo架构搭建
- [x] Web端基础UI
- [x] 用户档案录入
- [x] AI饮食计划生成
- [x] 本地数据持久化
- [x] PWA配置
- [x] 共享类型和工具函数

### 🚧 进行中 (v1.1)

- [ ] Mobile端Capacitor配置
- [ ] Android APK打包测试
- [ ] Backend API实现
- [ ] 用户认证系统
- [ ] 数据库集成

### 📅 计划中 (v2.0)

- [ ] iOS App Store上架
- [ ] Android各大应用市场上架
- [ ] 血糖数据可视化
- [ ] 社区功能
- [ ] 医生咨询对接
- [ ] 微信小程序版本

## 🤝 贡献指南

欢迎贡献! 请遵循以下步骤:

1. Fork本项目
2. 创建feature分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 文档: [Wiki]

---

**Made with ❤️ for people managing diabetes**

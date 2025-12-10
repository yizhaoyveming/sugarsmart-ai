# 智糖管家AI - 后端开发信息汇总

## ✅ 已收集的配置信息

### 豆包AI配置
```env
ARK_API_KEY=bfffdf1c-c056-47a6-ba54-bbace3ba28f5
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_MODEL=doubao-seed-1-6-250615
```

### 数据库配置（PostgreSQL）
```env
DATABASE_URL=postgresql://postgres:qh4bnsjh@sealos-ai-project-postgresql.ns-buqusu6v.svc:5432/postgres
```

### DevBox端口配置
```
端口3000: Web前端 - https://ypgcihlwutgw.sealoshzh.site
端口3001: App前端 - https://xbpnaciwyekd.sealoshzh.site
端口8080: 后端API - https://jyrslunpgmyn.sealoshzh.site ⭐
```

## 🎯 后端架构设计

### 技术栈
- **框架**: Express.js + TypeScript
- **ORM**: Prisma
- **认证**: JWT
- **AI**: 豆包API (OpenAI兼容格式)
- **数据库**: PostgreSQL 14
- **端口**: 8080

### API接口清单（11个核心接口）
1. **认证模块** (3个)
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/logout

2. **用户档案** (2个)
   - GET /api/users/:userId/profile
   - PUT /api/users/:userId/profile

3. **AI饮食计划** (2个) ⭐核心
   - POST /api/meal-plan/generate
   - GET /api/meal-plan/:date

4. **血糖记录** (3个)
   - POST /api/users/:userId/glucose
   - GET /api/users/:userId/glucose
   - DELETE /api/users/:userId/glucose/:recordId

5. **收藏功能** (3个)
   - POST /api/users/:userId/favorites
   - DELETE /api/users/:userId/favorites/:recipeId
   - GET /api/users/:userId/favorites

## 📦 项目结构
```
packages/backend/
├── src/
│   ├── index.ts              # 入口
│   ├── app.ts                # Express应用
│   ├── config/               # 配置
│   ├── middleware/           # 中间件
│   ├── routes/               # 路由
│   ├── controllers/          # 控制器
│   ├── services/             # 服务层（含AI）
│   └── utils/                # 工具函数
├── prisma/
│   └── schema.prisma         # 数据模型
├── .env
├── package.json
└── tsconfig.json
```

## 🚀 下一步操作
1. 创建后端项目结构
2. 初始化依赖和配置
3. 设计Prisma Schema
4. 实现核心API接口
5. 集成豆包AI
6. 测试和部署

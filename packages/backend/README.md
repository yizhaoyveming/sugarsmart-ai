# 智糖管家AI - 后端服务

## 📋 项目概述

智糖管家AI后端API服务，基于Express + TypeScript + Prisma + PostgreSQL构建，集成豆包AI生成个性化饮食计划。

## ✅ 已完成的工作

### 核心文件结构
```
packages/backend/
├── src/
│   ├── index.ts                    # ✅ 入口文件
│   ├── app.ts                      # ✅ Express应用
│   ├── config/
│   │   └── database.ts             # ✅ 数据库连接
│   ├── middleware/
│   │   └── auth.ts                 # ✅ JWT认证中间件
│   ├── routes/
│   │   └── api.routes.ts           # ✅ 所有API路由
│   ├── services/
│   │   └── ai.service.ts           # ✅ 豆包AI服务
│   └── utils/
│       └── jwt.ts                  # ✅ JWT工具函数
├── prisma/
│   └── schema.prisma               # ✅ 数据库模型
├── .env                            # ✅ 环境变量
├── .env.example                    # ✅ 环境变量示例
├── package.json                    # ✅ 依赖配置
└── tsconfig.json                   # ✅ TS配置
```

### 已实现的API接口（11个）

#### 1. 用户认证 (3个)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- ~~`POST /api/auth/logout`~~ - 登出（前端清除token即可）

#### 2. 用户档案 (2个)
- `GET /api/users/:userId/profile` - 获取用户档案
- `PUT /api/users/:userId/profile` - 更新用户档案

#### 3. AI饮食计划 (2个) ⭐ 核心功能
- `POST /api/meal-plan/generate` - AI生成饮食计划
- `GET /api/meal-plan/:date` - 获取某日计划

#### 4. 血糖记录 (3个)
- `POST /api/users/:userId/glucose` - 添加血糖记录
- `GET /api/users/:userId/glucose` - 获取血糖历史
- `DELETE /api/users/:userId/glucose/:recordId` - 删除记录

#### 5. 收藏功能 (3个)
- `POST /api/users/:userId/favorites` - 收藏食谱
- `DELETE /api/users/:userId/favorites/:recipeId` - 取消收藏
- `GET /api/users/:userId/favorites` - 获取收藏列表

## 🚀 快速开始

### 步骤1: 安装依赖

```bash
cd packages/backend
pnpm install
```

### 步骤2: 配置环境变量

环境变量已配置在 `.env` 文件中：

```env
# 数据库
DATABASE_URL=postgresql://postgres:qh4bnsjh@sealos-ai-project-postgresql.ns-buqusu6v.svc:5432/postgres

# 服务器
PORT=8080
NODE_ENV=development

# JWT
JWT_SECRET=sugarsmart-ai-jwt-secret-key-2025-change-in-production
JWT_EXPIRES_IN=7d

# 豆包AI
ARK_API_KEY=bfffdf1c-c056-47a6-ba54-bbace3ba28f5
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_MODEL=doubao-seed-1-6-250615

# CORS
ALLOWED_ORIGINS=https://ypgcihlwutgw.sealoshzh.site,https://xbpnaciwyekd.sealoshzh.site,http://localhost:3000,http://localhost:3001
```

### 步骤3: 初始化数据库

```bash
# 生成Prisma Client
pnpm prisma:generate

# 推送数据库Schema（首次使用）
pnpm prisma:push

# 或者使用迁移（推荐生产环境）
pnpm prisma:migrate
```

### 步骤4: 启动服务器

```bash
# 开发模式（热重载）
pnpm dev

# 生产模式
pnpm build
pnpm start
```

### 步骤5: 验证服务

访问健康检查端点：
```bash
curl http://localhost:8080/health
```

应该返回：
```json
{
  "status": "healthy",
  "service": "SugarSmart AI Backend",
  "timestamp": "2025-12-06T09:40:00.000Z"
}
```

## 🧪 API测试示例

### 1. 用户注册
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "test123",
    "nickname": "测试用户"
  }'
```

### 2. 用户登录
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "test123"
  }'
```

保存返回的token，后续请求需要用到。

### 3. 生成AI饮食计划（需要token）
```bash
curl -X POST http://localhost:8080/api/meal-plan/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "age": 45,
    "height": 170,
    "weight": 75,
    "gender": "Male",
    "diabetesType": "Type 2",
    "fastingGlucose": "7.2",
    "medication": "二甲双胍",
    "stapleFood": ["米饭", "面条"],
    "allergies": ["海鲜"],
    "mealsPerDay": 3,
    "specialRequests": "希望低盐低脂"
  }'
```

## 📊 数据库Schema

### 核心表（5张）

1. **users** - 用户表
2. **user_profiles** - 用户档案
3. **glucose_records** - 血糖记录
4. **meal_plans** - 饮食计划
5. **favorites** - 收藏

详细定义见 `prisma/schema.prisma`

## 🔧 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 生产模式
pnpm start

# Prisma相关
pnpm prisma:generate    # 生成Prisma Client
pnpm prisma:push        # 推送Schema到数据库
pnpm prisma:migrate     # 创建迁移

# 数据库管理
# 使用 Sealos Chat2DB 管理数据库（推荐）
# 访问 Sealos 控制台 -> 数据库 -> Chat2DB
```

## 🌐 部署到Sealos

### 当前配置
- **端口**: 8080
- **公网地址**: https://jyrslunpgmyn.sealoshzh.site
- **数据库**: Sealos PostgreSQL (已配置)

### 部署步骤

1. 确保在DevBox中：
```bash
pwd  # 应该在 /home/devbox/project
```

2. 进入backend目录：
```bash
cd packages/backend
```

3. 安装依赖并初始化：
```bash
pnpm install
pnpm prisma:generate
pnpm prisma:push
```

4. 启动服务：
```bash
pnpm dev
```

服务将运行在端口8080，可通过以下地址访问：
- 内网: http://devbox.ns-buqusu6v:8080
- 公网: https://jyrslunpgmyn.sealoshzh.site

## 🔗 前端集成

### 修改前端环境变量

**packages/web/.env**
```env
VITE_API_BASE_URL=https://jyrslunpgmyn.sealoshzh.site
VITE_MOCK_MODE=false
```

**packages/app/.env**
```env
VITE_API_BASE_URL=https://jyrslunpgmyn.sealoshzh.site
VITE_MOCK_MODE=false
```

## 📝 后续优化建议

### 短期（1-2周）
- [ ] 添加请求日志记录
- [ ] 添加API响应缓存（Redis）
- [ ] 完善错误处理和日志
- [ ] 添加API文档（Swagger）

### 中期（1个月）
- [ ] 添加单元测试
- [ ] 添加集成测试
- [ ] 性能优化
- [ ] 安全加固（速率限制、SQL注入防护）

### 长期（2-3个月）
- [ ] 微服务拆分
- [ ] 消息队列集成
- [ ] 实时通知（WebSocket）
- [ ] 数据分析和报表系统

## 🐛 常见问题

### 1. 数据库连接失败
- 检查 `.env` 中的 `DATABASE_URL` 是否正确
- 确保Sealos数据库正在运行
- 使用 Sealos Chat2DB 查看数据库连接状态

### 2. AI调用失败
- 检查 `ARK_API_KEY` 是否有效
- 确认豆包API配额是否充足
- 查看错误日志

### 3. TypeScript编译错误
```bash
# 重新安装依赖
rm -rf node_modules
pnpm install
```

### 4. 端口被占用
```bash
# 查找占用端口的进程
lsof -i:8080
# 杀死进程
kill -9 <PID>
```

## 📞 联系方式

- 项目仓库: https://github.com/yizhaoyveming/sugarsmart-ai
- 问题反馈: Issues
- 文档: Wiki

---

**Made with ❤️ for diabetes management**

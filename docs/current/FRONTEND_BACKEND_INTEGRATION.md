# 🔗 前后端联调测试指南

## ✅ 配置完成状态

**完成时间**: 2025-12-06  
**配置状态**: 🟢 已完成  

---

## 📋 已完成的配置

### 1. 后端服务 ✅

**运行地址**:
- 内网: `http://localhost:8080`
- 公网: `https://jyrslunpgmyn.sealoshzh.site`

**数据库状态**: ✅ 5张表已创建并验证
- users
- user_profiles
- glucose_records
- meal_plans
- favorites

**API接口**: ✅ 11个接口已实现并测试

### 2. Web端配置 ✅

**文件**: `packages/web/.env`

```env
VITE_API_BASE_URL=https://jyrslunpgmyn.sealoshzh.site
VITE_MOCK_MODE=false
```

**公网地址**: https://ypgcihlwutgw.sealoshzh.site

### 3. App端配置 ✅

**文件**: `packages/app/.env`

```env
VITE_API_BASE_URL=https://jyrslunpgmyn.sealoshzh.site
VITE_MOCK_MODE=false
```

**公网地址**: https://xbpnaciwyekd.sealoshzh.site

### 4. Prisma Studio清理 ✅

已删除5555端口相关配置：
- ✅ 删除 `package.json` 中的 `prisma:studio` 脚本
- ✅ 修改 `README.md` 使用Sealos Chat2DB
- ✅ 修改 `BACKEND_DEPLOYMENT_COMPLETE.md` 文档

---

## 🚀 启动服务

### 步骤1: 启动后端服务

```bash
# 打开第1个终端
cd packages/backend
pnpm dev
```

**预期输出**:
```
🚀 服务器运行在端口 8080
✅ 数据库连接成功
```

### 步骤2: 启动Web管理端

```bash
# 打开第2个终端
cd packages/web
pnpm dev
```

**预期输出**:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: https://ypgcihlwutgw.sealoshzh.site/
```

### 步骤3: 启动App患者端

```bash
# 打开第3个终端
cd packages/app
pnpm dev
```

**预期输出**:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3001/
➜  Network: https://xbpnaciwyekd.sealoshzh.site/
```

---

## 🧪 联调测试清单

### 测试1: 用户注册和登录 ⭐ 必测

#### 步骤
1. 访问 Web端 或 App端
2. 找到注册入口
3. 填写用户信息：
   - 用户名: `testuser`
   - 密码: `test123`
   - 昵称: `测试用户`
4. 点击注册按钮
5. 使用注册的账号登录

#### 预期结果
- ✅ 注册成功，返回用户信息和token
- ✅ 登录成功，跳转到主页面
- ✅ token保存到localStorage
- ✅ 后续请求携带Authorization header

#### 验证方法
打开浏览器开发者工具：
- Network标签：查看请求返回状态码200
- Application → Local Storage：查看token
- Console：无错误信息

---

### 测试2: AI生成饮食计划 ⭐ 核心功能

#### 前提条件
- 已登录账号

#### 步骤
1. 进入"健康档案"或"饮食计划"页面
2. 填写或更新健康档案：
   - 年龄: 45
   - 身高: 170cm
   - 体重: 75kg
   - 糖尿病类型: Type 2
   - 空腹血糖: 7.2
   - 用药情况: 二甲双胍
3. 点击"生成饮食计划"按钮
4. 等待AI生成（3-5秒）

#### 预期结果
- ✅ 显示加载状态
- ✅ 成功生成早中晚三餐计划
- ✅ 每餐包含：
  - 食谱名称
  - 食材清单
  - 烹饪步骤
  - 营养成分
  - 健康小贴士

#### 验证方法
- Network标签：查看 `/api/meal-plan/generate` 请求
- 响应时间：3-5秒
- 响应数据：包含3个食谱对象

---

### 测试3: 血糖记录管理

#### 步骤
1. 进入"血糖追踪"页面
2. 添加血糖记录：
   - 血糖值: 6.5
   - 测量时间: 选择当前时间
   - 测量类型: 空腹/餐后
3. 点击保存
4. 查看记录列表
5. 删除一条记录

#### 预期结果
- ✅ 成功添加记录
- ✅ 列表显示新记录
- ✅ 成功删除记录
- ✅ 数据实时更新

---

### 测试4: 用户档案管理

#### 步骤
1. 进入"个人中心"或"健康档案"
2. 修改档案信息
3. 点击保存

#### 预期结果
- ✅ 成功更新档案
- ✅ 刷新页面后数据仍然保留

---

### 测试5: 收藏功能

#### 步骤
1. 在饮食计划页面
2. 点击某个食谱的"收藏"按钮
3. 进入"我的收藏"页面查看
4. 取消收藏

#### 预期结果
- ✅ 成功收藏食谱
- ✅ 收藏列表显示该食谱
- ✅ 成功取消收藏

---

## 🐛 常见问题排查

### 问题1: 前端请求失败 (Network Error)

**症状**:
- Console显示: `Network Error` 或 `Failed to fetch`
- 接口状态码: 无

**检查清单**:
1. ✅ 后端服务是否正在运行？
   ```bash
   # 测试后端健康检查
   curl https://jyrslunpgmyn.sealoshzh.site/health
   ```

2. ✅ 前端 `.env` 配置是否正确？
   ```bash
   # 检查Web端
   cat packages/web/.env
   # 检查App端
   cat packages/app/.env
   ```

3. ✅ 是否需要重启前端服务？
   ```bash
   # Ctrl+C 停止服务，然后重新启动
   pnpm dev
   ```

---

### 问题2: CORS跨域错误

**症状**:
- Console显示: `Access-Control-Allow-Origin` 错误

**解决方案**:
检查后端 `.env` 中的 `ALLOWED_ORIGINS`：
```env
ALLOWED_ORIGINS=https://ypgcihlwutgw.sealoshzh.site,https://xbpnaciwyekd.sealoshzh.site,http://localhost:3000,http://localhost:3001
```

确保包含了前端的公网地址。

---

### 问题3: 401 Unauthorized

**症状**:
- 接口返回401状态码
- 提示未授权

**检查清单**:
1. ✅ 是否已登录？
2. ✅ token是否过期？（默认7天）
3. ✅ 请求头是否携带Authorization？
   - 格式: `Authorization: Bearer <token>`

**解决方案**:
重新登录获取新token。

---

### 问题4: 500 Internal Server Error

**症状**:
- 接口返回500状态码

**检查清单**:
1. ✅ 查看后端终端的错误日志
2. ✅ 数据库连接是否正常？
   ```bash
   # 使用Sealos Chat2DB查看数据库
   ```
3. ✅ AI API配额是否充足？
   - 检查豆包AI账号余额

---

### 问题5: AI生成失败

**症状**:
- 生成饮食计划失败
- 长时间无响应

**检查清单**:
1. ✅ 豆包API Key是否有效？
   ```env
   ARK_API_KEY=bfffdf1c-c056-47a6-ba54-bbace3ba28f5
   ```
2. ✅ 网络是否畅通？
3. ✅ API调用配额是否充足？

**解决方案**:
查看后端日志，确认具体错误信息。

---

## 📊 性能监控

### 关键指标

| 接口 | 目标响应时间 | 可接受范围 |
|------|--------------|------------|
| 健康检查 | <10ms | <50ms |
| 用户注册 | <100ms | <500ms |
| 用户登录 | <100ms | <500ms |
| AI生成计划 | 3-5s | <10s |
| 查询血糖记录 | <50ms | <200ms |
| 添加血糖记录 | <100ms | <300ms |

### 监控方法

使用浏览器开发者工具 Network 标签：
1. 打开Network标签
2. 执行操作
3. 查看请求详情：
   - Time: 总耗时
   - Waiting: 服务器处理时间
   - Status: 状态码

---

## 🎯 联调测试报告模板

### 测试环境
- 后端版本: 1.0.0
- Web端版本: 1.0.0
- App端版本: 1.0.0
- 测试时间: YYYY-MM-DD

### 测试结果

| 功能 | 状态 | 备注 |
|------|------|------|
| 用户注册 | ✅ / ❌ | |
| 用户登录 | ✅ / ❌ | |
| AI生成计划 | ✅ / ❌ | |
| 血糖记录 | ✅ / ❌ | |
| 用户档案 | ✅ / ❌ | |
| 收藏功能 | ✅ / ❌ | |

### 发现的问题
1. 
2. 
3. 

### 优化建议
1. 
2. 
3. 

---

## 📚 相关文档

- **后端API文档**: `packages/backend/README.md`
- **后端部署报告**: `BACKEND_DEPLOYMENT_COMPLETE.md`
- **API接口详情**: `packages/backend/src/routes/api.routes.ts`

---

## 🎉 下一步

联调测试通过后，可以开始：

### 短期任务
1. [ ] 完善错误处理和用户提示
2. [ ] 添加加载状态和骨架屏
3. [ ] 优化AI生成体验
4. [ ] 添加数据校验

### 中期任务
1. [ ] 添加单元测试和E2E测试
2. [ ] 性能优化和缓存策略
3. [ ] 完善文档和注释
4. [ ] 准备生产环境部署

### 长期规划
1. [ ] 数据分析和可视化增强
2. [ ] 多语言支持
3. [ ] 离线功能
4. [ ] 移动端原生打包

---

**🎯 准备开始联调测试！**

**Made with ❤️ for diabetes management**

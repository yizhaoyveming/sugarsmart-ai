# 🔍 APK网络连接问题诊断报告

## 📊 问题现象

- ✅ **手机浏览器**：可以登录 (`https://xbpnaciwyekd.sealoshzh.site`)
- ✅ **电脑浏览器**：可以登录
- ✅ **DevBox Backend**：本地API完全正常
- ❌ **APK应用**：显示"无法连接到服务器"

---

## 🎯 根本原因分析

### 问题1: Vite配置缺少envPrefix（核心问题）⭐⭐⭐⭐⭐

**当前配置** (`packages/app/vite.config.ts`):
```typescript
export default defineConfig({
  server: {
    port: 3001,
    // ...
  },
  plugins: [react()],
  // ❌ 缺少 envPrefix 配置！
});
```

**问题说明**:
- Vite 默认**不会**将以`VITE_`开头的环境变量注入到生产构建中
- 需要明确配置 `envPrefix: ['VITE_']`
- 在开发模式（`vite dev`）下可能工作，但在构建模式（`vite build`）下会失败

**影响**:
```javascript
// packages/app/services/apiClient.ts
this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
//             ↑ 在APK中可能是 undefined
//             ↓ 回退到默认值
this.baseURL = 'http://localhost:3000';  // ❌ 错误的地址！
```

---

### 问题2: 默认URL指向localhost（次要问题）⭐⭐⭐

**当前代码**:
```typescript
this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
//                                                     ↑ 问题在这里
```

**问题**:
- 如果环境变量没有正确注入
- 手机APK会尝试连接 `http://localhost:3000`
- 这是手机自己的localhost，不是Backend服务器
- 导致"无法连接到服务器"

---

### 问题3: Sealos Backend API路由问题（已确认）⭐⭐⭐⭐

**测试结果**:
```bash
# DevBox Backend (本地)
curl http://localhost:8080/api/auth/login
{"success":true, ...}  ✅ 正常

# Sealos Backend (云端)
curl https://jyrslunpgmyn.sealoshzh.site/api/auth/login
{"success":false,"error":{"code":"NOT_FOUND"}}  ❌ 路由不存在
```

**问题**:
- Sealos上的Backend代码版本旧
- 缺少 `/api/auth/*` 路由
- 需要重新部署

---

## ✅ 解决方案

### 方案A: 修复Vite配置（推荐）⭐⭐⭐⭐⭐

**修改 `packages/app/vite.config.ts`**:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3001,
    host: '0.0.0.0',
    allowedHosts: [
      'xbpnaciwyekd.sealoshzh.site',
    ],
  },
  plugins: [react()],
  
  // ✅ 添加这个配置！
  envPrefix: ['VITE_'],
  
  // 🔧 修复 EXDEV 错误
  cacheDir: '/tmp/.vite-app',
  
  // 依赖优化配置
  optimizeDeps: {
    force: true,
  },
});
```

**效果**:
- ✅ 环境变量正确注入到构建中
- ✅ `import.meta.env.VITE_API_BASE_URL` 有正确的值
- ✅ APK会连接正确的Backend地址

---

### 方案B: 修复apiClient默认值（备用）⭐⭐⭐

**修改 `packages/app/services/apiClient.ts`**:

```typescript
constructor() {
  // 改进默认值逻辑
  this.baseURL = import.meta.env.VITE_API_BASE_URL || 
                 import.meta.env.PROD 
                   ? 'https://jyrslunpgmyn.sealoshzh.site'  // 生产环境默认值
                   : 'http://localhost:8080';  // 开发环境默认值
  
  this.mockMode = import.meta.env.VITE_MOCK_MODE === 'true';
  this.token = localStorage.getItem('auth_token');
}
```

**效果**:
- ✅ 即使环境变量未注入，也有合理的默认值
- ✅ 生产环境不会指向localhost

---

### 方案C: 重新部署Sealos Backend（必须）⭐⭐⭐⭐⭐

**问题**:
- Sealos Backend缺少 `/api/auth/*` 路由

**解决**:
1. 确认本地Backend代码最新
2. 推送到Sealos重新部署
3. 验证API可用性

---

## 🚀 推荐实施步骤

### 立即执行（5分钟）

**1. 修复Vite配置**:
```bash
# 添加 envPrefix 到 vite.config.ts
# 提交并推送
git add packages/app/vite.config.ts
git commit -m "fix: 添加Vite envPrefix配置以正确注入环境变量"
git push origin main
```

**2. 等待GitHub Actions构建**（5-10分钟）

**3. 下载新APK测试**

---

### 并行执行（30分钟）

**重新部署Sealos Backend**:
1. 确认Backend代码已推送到Git
2. 在Sealos控制台触发重新构建
3. 验证API: `https://jyrslunpgmyn.sealoshzh.site/api/auth/login`

---

## 🔬 验证方法

### 验证1: 检查构建的JS文件

**GitHub Actions构建完成后**:
```bash
# 下载并解压APK
# 查看打包的JS文件中是否包含正确的API地址
```

### 验证2: 测试APK

**安装新APK后**:
1. 打开应用
2. 尝试登录
3. 应该能成功连接Backend

### 验证3: Backend API

**访问**:
```bash
curl -X POST https://jyrslunpgmyn.sealoshzh.site/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

**应该返回**:
```json
{"success":true,"data":{"user":{...},"token":"..."}}
```

---

## 📝 总结

**主要问题**:
1. ⭐⭐⭐⭐⭐ Vite配置缺少 `envPrefix`，导致环境变量未注入
2. ⭐⭐⭐⭐ Sealos Backend代码版本旧，缺少API路由
3. ⭐⭐⭐ apiClient默认值指向localhost

**修复优先级**:
1. **立即**: 添加 `envPrefix: ['VITE_']` 到 `vite.config.ts`
2. **并行**: 重新部署Sealos Backend
3. **可选**: 改进apiClient默认值逻辑

**预期结果**:
- ✅ APK正确读取环境变量
- ✅ 连接到正确的Backend地址
- ✅ 用户可以正常登录

---

**创建时间**: 2025-12-07
**维护者**: SugarSmart AI Team

# 📱 智糖管家AI - App打包与分发指南

## ✅ 已完成配置

您的Android App已成功配置为通过GitHub Actions自动构建！

### 完成的工作

- ✅ **修复构建路径**：将workflow中的`packages/mobile`改为`packages/app`
- ✅ **清理敏感信息**：删除`.env`中未使用的`VITE_GEMINI_API_KEY`
- ✅ **推送代码**：代码已推送到GitHub，构建已触发
- ✅ **安全配置**：API密钥在后端，HTTPS通信，JWT认证

---

## 🚀 如何查看构建进度

### 步骤1：访问GitHub Actions页面

```
https://github.com/yizhaoyveming/sugarsmart-ai/actions
```

### 步骤2：查看最新构建

1. 页面会显示所有构建记录
2. 最新的构建会在最上方
3. 查看状态：
   - 🟡 **黄色圆圈**：正在构建中（预计5-10分钟）
   - ✅ **绿色勾**：构建成功
   - ❌ **红色叉**：构建失败（查看日志排查）

### 步骤3：实时查看构建日志

1. 点击构建记录
2. 展开每个步骤查看详细日志
3. 等待所有步骤完成

---

## 📦 如何下载APK

### 方法A：从Artifacts下载（推荐）

**适用场景**：每次代码推送后

**步骤**：
1. 构建成功后，滚动到页面底部
2. 找到 **Artifacts** 区域
3. 点击 `sugarsmart-ai-debug-xxx` 下载ZIP文件
4. 解压得到 `app-debug.apk`

**保留时间**：30天

**直达链接**：
```
https://github.com/yizhaoyveming/sugarsmart-ai/actions
```

---

### 方法B：从Releases下载

**适用场景**：正式发布版本

**如何创建Release**：
```bash
# 在项目根目录
git tag v1.0.0
git push origin v1.0.0
```

**步骤**：
1. 访问：`https://github.com/yizhaoyveming/sugarsmart-ai/releases`
2. 找到对应版本
3. 在Assets区域下载APK

**保留时间**：永久

---

## 📱 如何分发给用户

### 方式1：GitHub直接分发（免费）

**发送给用户**：
```
APK下载链接：
https://github.com/yizhaoyveming/sugarsmart-ai/releases

安装步骤：
1. 点击链接下载最新版本的APK
2. 允许浏览器下载未知应用
3. 打开下载的APK文件安装
4. 允许安装未知来源应用
5. 完成安装
```

**优点**：
- ✅ 完全免费
- ✅ 版本管理方便
- ✅ 支持更新通知

**缺点**：
- ⚠️ 用户需要GitHub账号（公开仓库不需要）
- ⚠️ 国内访问可能较慢

---

### 方式2：下载后分享

**步骤**：
1. 从GitHub下载APK
2. 通过微信/QQ/邮件发送给用户
3. 或上传到云盘（百度网盘、阿里云盘等）

**优点**：
- ✅ 用户无需访问GitHub
- ✅ 分发灵活

**缺点**：
- ⚠️ 每次更新需要重新分享
- ⚠️ 版本管理需要手动维护

---

## 📲 用户安装指南

### Android手机安装步骤

**1. 下载APK**
- 方式1：访问GitHub Releases页面下载
- 方式2：从微信/QQ等接收APK文件

**2. 允许安装未知应用**
- 打开手机 **设置**
- 搜索 "未知来源" 或 "安装未知应用"
- 找到浏览器或文件管理器
- 允许安装未知应用

**不同品牌操作**：
- **华为/荣耀**：设置 > 安全 > 更多安全设置 > 安装外部来源应用
- **小米**：设置 > 应用设置 > 应用管理 > 右上角三点 > 特殊权限 > 安装未知应用
- **OPPO/vivo**：设置 > 安全 > 安装外部来源应用
- **三星**：设置 > 生物识别和安全性 > 安装未知应用

**3. 安装应用**
- 点击下载的 `app-debug.apk` 文件
- 点击 **安装** 按钮
- 等待安装完成
- 点击 **打开** 或在桌面找到"智糖管家AI"图标

**4. 首次打开**
- 允许必要的权限（网络、存储等）
- 注册或登录账号
- 开始使用！

---

## 🔄 如何触发新的构建

### 触发方式1：代码推送（自动）

**每次修改代码后**：
```bash
# 在项目根目录
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

✅ **自动触发构建**，无需额外操作

---

### 触发方式2：手动触发

**步骤**：
1. 访问：`https://github.com/yizhaoyveming/sugarsmart-ai/actions`
2. 点击左侧 **Build Android APK**
3. 点击右侧 **Run workflow** 按钮
4. 选择分支（main）
5. 点击绿色的 **Run workflow** 确认

✅ **适用场景**：想重新构建但不想修改代码

---

### 触发方式3：创建Release版本

**步骤**：
```bash
# 创建版本标签
git tag v1.0.0
git push origin v1.0.0
```

✅ **自动构建并创建GitHub Release**

---

## 📊 构建状态说明

### 构建时间

| 阶段 | 预计时间 |
|------|---------|
| 首次构建 | 8-12分钟 |
| 后续构建 | 5-8分钟 |
| 缓存命中 | 3-5分钟 |

### 构建步骤

1. **Checkout code** (10秒)
2. **Setup Node.js** (15秒)
3. **Setup Java** (20秒)
4. **Setup pnpm** (10秒)
5. **Install dependencies** (60-120秒)
6. **Build shared** (30秒)
7. **Build app** (60-90秒)
8. **Setup Android SDK** (60秒)
9. **Initialize Android** (30秒)
10. **Build APK** (120-180秒)
11. **Upload artifact** (20秒)

---

## 🔍 常见问题

### Q1: 构建失败怎么办？

**查看错误日志**：
1. 点击失败的构建记录
2. 展开红色×标记的步骤
3. 查看详细错误信息

**常见错误**：

**错误1**: `pnpm install failed`
```bash
# 本地测试
pnpm install
pnpm --filter @sugarsmart/app build

# 如果本地正常，可能是缓存问题
# 在GitHub Actions页面重新运行workflow
```

**错误2**: `gradlew assembleDebug failed`
```bash
# 检查capacitor配置
cat packages/app/capacitor.config.ts

# 确保appId格式正确
appId: 'com.sugarsmart.ai'
```

**错误3**: `Build app application failed`
```bash
# 检查package.json中的filter名称
# 应该是 @sugarsmart/app
```

---

### Q2: APK在哪里？

**从Artifacts下载**：
- 构建成功后在页面底部
- 点击 `sugarsmart-ai-debug-xxx` 下载

**从Releases下载**：
- 访问 Releases 页面
- 在Assets区域下载

---

### Q3: 手机无法安装APK？

**原因1：未允许未知来源**
- 解决：设置中允许安装未知应用

**原因2：签名冲突**
- 如果之前安装过，先卸载旧版本
- 然后重新安装新版本

**原因3：手机系统限制**
- 部分品牌（如华为）会拦截Debug APK
- 建议使用Release签名版本

---

### Q4: 如何更新版本？

**修改版本号**：
```bash
# 编辑 packages/app/.env
VITE_APP_VERSION=1.0.1

# 编辑 packages/app/package.json
"version": "1.0.1"

# 提交并推送
git add .
git commit -m "chore: 升级版本到1.0.1"
git push

# 创建版本标签（可选）
git tag v1.0.1
git push origin v1.0.1
```

---

### Q5: 如何配置Release签名？

**当前是Debug APK**，适合内测。如需正式发布：

**步骤1：生成密钥库**
```bash
keytool -genkey -v -keystore sugarsmart-release.keystore \
  -alias sugarsmart -keyalg RSA -keysize 2048 -validity 10000
```

**步骤2：配置GitHub Secrets**
- 进入仓库 Settings > Secrets > Actions
- 添加密钥信息（KEYSTORE_FILE、KEYSTORE_PASSWORD等）

**步骤3：更新workflow**
- 修改 `assembleDebug` 为 `assembleRelease`

---

## 💡 最佳实践

### 开发阶段（当前）

✅ **使用Debug APK**
- 快速构建
- 无需签名
- 适合内测

✅ **通过GitHub分发**
- 免费
- 版本管理方便

✅ **用户<100人**
- 不上架应用商店
- 降低成本

---

### 扩展阶段（100-1000用户）

🔄 **升级为Release APK**
- 配置签名
- 更专业

🔄 **上架应用市场**
- 华为应用市场（国内用户多）
- 小米应用商店
- OPPO软件商店

---

### 规模化阶段（1000+用户）

🚀 **上架主流应用商店**
- Google Play（国际）
- App Store（iOS）
- 各大应用市场

🚀 **自动化发布**
- CI/CD自动发布
- 版本自动更新

---

## 📈 数据统计

### 构建历史

查看所有构建记录：
```
https://github.com/yizhaoyveming/sugarsmart-ai/actions
```

### 下载统计

Release下载次数会显示在Releases页面

---

## 🎯 下一步建议

### 立即可做

1. ✅ **测试APK**
   - 下载刚构建的APK
   - 在手机上安装测试
   - 验证所有功能

2. ✅ **分享给测试用户**
   - 发送GitHub Releases链接
   - 或直接发送APK文件

3. ✅ **收集反馈**
   - 记录用户问题
   - 快速迭代修复

---

### 未来优化（用户增长后）

1. 🔄 **配置Release签名**
   - 更安全
   - 可上架应用商店

2. 🔄 **添加自动更新**
   - 检测新版本
   - 提示用户更新

3. 🔄 **性能优化**
   - 代码混淆
   - 包体积优化

---

## 📞 技术支持

### 构建问题

- 查看GitHub Actions日志
- 检查workflow配置
- 提交Issue

### 安装问题

- 查看本文档的"用户安装指南"
- 检查手机系统设置

---

## 📚 相关文档

- [GitHub Actions指南](packages/app/GITHUB_ACTIONS_GUIDE.md)
- [Capacitor配置](packages/app/CAPACITOR_SETUP_GUIDE.md)
- [PM2使用指南](PM2_USAGE_GUIDE.md)

---

## 🎊 恭喜！

您的Android App已经可以：
- ✅ 自动构建
- ✅ 免费分发
- ✅ 版本管理
- ✅ 快速迭代

**立即访问**：
```
https://github.com/yizhaoyveming/sugarsmart-ai/actions
```

查看您的首次构建进度！

---

**最后更新**：2025-12-07
**维护者**：SugarSmart AI Team

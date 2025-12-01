# 📱 智糖管家AI - PWA安装指南

## 🎯 什么是PWA？

PWA（Progressive Web App，渐进式网页应用）是一种可以像原生App一样使用的网页应用。安装后，智糖管家AI将：

- ✅ **无浏览器UI干扰** - 应用全屏显示，隐藏地址栏和标签栏
- ✅ **独立应用图标** - 添加到主屏幕，像普通App一样启动
- ✅ **流畅体验** - 类似原生App的交互和动画效果
- ✅ **离线支持** - 部分功能可离线使用（即将支持）
- ✅ **快速启动** - 秒开无需等待浏览器加载

---

## 📲 iOS设备安装指南（iPhone/iPad）

### 步骤1: 打开应用
在Safari浏览器中访问智糖管家AI应用地址：
```
https://ypgcihlwutgw.sealoshzh.site  (端口3000)
或
https://xbpnaciwyekd.sealoshzh.site  (端口3001)
```

⚠️ **重要提示**: 必须使用Safari浏览器！Chrome/Firefox等其他浏览器不支持iOS上的PWA安装。

### 步骤2: 点击分享按钮
- 在Safari底部导航栏，找到并点击**分享图标**（方框向上箭头 ⬆️）

<img src="https://support.apple.com/library/content/dam/edam/applecare/images/en_US/safari/ios-safari-share-icon.png" width="50" alt="Safari分享按钮">

### 步骤3: 添加到主屏幕
- 在弹出的分享菜单中，**向下滚动**找到"添加到主屏幕"选项
- 点击"添加到主屏幕"（Add to Home Screen）

### 步骤4: 确认安装
- 会显示应用图标和名称预览："智糖管家"
- 可以编辑名称（可选）
- 点击右上角"添加"按钮确认

### 步骤5: 从主屏幕启动
- 返回主屏幕，找到"智糖管家"图标
- **点击图标启动应用** - 这时应用会以全屏模式运行！
- ✨ 浏览器UI已完全隐藏，享受原生App体验

---

## 🤖 Android设备安装指南

### 步骤1: 打开应用
在Chrome浏览器中访问智糖管家AI应用地址：
```
https://ypgcihlwutgw.sealoshzh.site  (端口3000)
或
https://xbpnaciwyekd.sealoshzh.site  (端口3001)
```

### 步骤2: 查看安装提示
- Chrome会自动检测PWA并在地址栏下方显示"安装"横幅
- 如果没有自动显示，点击右上角**三点菜单**（⋮）

### 步骤3: 添加到主屏幕
**方法A - 使用安装横幅**:
- 点击底部弹出的"安装"或"添加到主屏幕"按钮

**方法B - 通过菜单**:
1. 点击右上角三点菜单（⋮）
2. 选择"安装应用"或"添加到主屏幕"
3. 确认安装

### 步骤4: 确认安装
- 弹出安装确认对话框
- 显示应用名称："智糖管家AI - 糖尿病营养管理"
- 点击"安装"或"添加"按钮

### 步骤5: 从主屏幕/应用抽屉启动
- 智糖管家图标会添加到主屏幕或应用抽屉
- **点击图标启动** - 应用以standalone模式运行
- ✨ 无浏览器标签栏和地址栏，全屏沉浸式体验

---

## 🖥️ 桌面设备安装指南（Windows/Mac/Linux）

### Chrome浏览器
1. 访问应用URL
2. 点击地址栏右侧的"安装"图标（➕ 或 💻）
3. 确认安装
4. 应用会在独立窗口中打开

### Edge浏览器
1. 访问应用URL
2. 点击地址栏右侧的"安装"图标
3. 或通过菜单: 设置 → 应用 → 安装此网站作为应用
4. 确认安装

---

## ✅ 验证安装成功

安装成功后，您应该看到：

### ✨ 全屏显示
- **无地址栏** - 顶部没有浏览器地址栏
- **无标签栏** - 没有浏览器标签切换区域
- **无导航按钮** - 没有前进/后退/刷新按钮
- **填满屏幕** - 内容从屏幕最上方到最下方完全填充

### 🎨 iOS刘海屏适配
- 状态栏区域（刘海/药丸区域）被应用背景色填充
- 内容不会被刘海遮挡
- 底部安全区域（Home Indicator）被正确处理

### 📱 独立启动
- 点击主屏幕图标，应用在独立窗口/全屏模式启动
- 不会打开浏览器再跳转
- 任务切换器中显示为独立应用

---

## 🔧 故障排除

### 问题1: iOS没有"添加到主屏幕"选项
**原因**: 未使用Safari浏览器
**解决方案**: 
- 必须使用Safari浏览器
- Chrome/Firefox不支持iOS的PWA功能

### 问题2: 安装后仍显示浏览器UI
**原因**: 通过浏览器打开而不是主屏幕图标
**解决方案**:
- 关闭浏览器中的页面
- 返回主屏幕，点击应用图标启动
- 确保是从独立图标启动，不是浏览器标签

### 问题3: Android没有安装提示
**原因**: 可能使用了非Chrome浏览器或PWA配置未生效
**解决方案**:
1. 确保使用Chrome浏览器
2. 手动通过菜单添加：三点菜单 → 安装应用
3. 清除浏览器缓存后重试

### 问题4: 应用宽度未填满屏幕
**原因**: 
- CSS中的max-width限制（已修复）
- 可能是缓存问题
**解决方案**:
1. 强制刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）
2. 清除浏览器缓存
3. 重新添加到主屏幕

### 问题5: 图标显示异常或默认图标
**原因**: PWA图标文件缺失
**临时解决方案**:
- 应用仍可正常使用，只是图标不美观
- 等待开发者补充icon-192.png和icon-512.png文件

---

## 🎨 创建PWA图标（开发者指南）

### 所需图标规格
智糖管家AI需要以下两个图标文件：

1. **icon-192.png** (192x192像素)
   - 用于Android主屏幕图标
   - 用于PWA启动画面
   
2. **icon-512.png** (512x512像素)
   - 用于高分辨率设备
   - Android启动画面和应用商店

### 设计建议
- **主题色**: 使用应用主色调（绿色#2E7D32）
- **图案**: 推荐使用ChefHat或Activity图标结合"糖"字
- **背景**: 纯色或渐变背景，避免透明
- **圆角**: Android会自动添加圆角，设计时保持方形
- **安全区**: 重要元素保持在中心80%区域内

### 快速创建方法

**方法1: 使用在线工具**
1. 访问 https://www.pwabuilder.com/imageGenerator
2. 上传一张512x512的PNG图片
3. 工具会自动生成所有需要的尺寸
4. 下载并放入`sugarsmart-ai/public/`目录

**方法2: 使用Figma/Sketch设计**
1. 创建512x512画布
2. 绘制应用图标
3. 导出PNG格式
4. 使用ImageMagick调整尺寸：
   ```bash
   # 生成192x192
   convert icon-512.png -resize 192x192 icon-192.png
   ```

**方法3: 临时使用SVG转PNG**
可以使用以下SVG代码生成简易图标：
```svg
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2E7D32"/>
  <text x="256" y="280" font-size="200" fill="white" 
        text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">
    糖
  </text>
</svg>
```
使用在线SVG转PNG工具转换即可。

---

## 📊 技术实现细节（开发者参考）

### 已实现的PWA特性

#### 1. HTML Meta标签配置 (index.html)
```html
<!-- Viewport配置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />

<!-- PWA核心标签 -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- 主题颜色 -->
<meta name="theme-color" content="#2E7D32">

<!-- 应用标题 -->
<meta name="apple-mobile-web-app-title" content="智糖管家">

<!-- 禁用自动电话号码识别 -->
<meta name="format-detection" content="telephone=no">

<!-- Manifest链接 -->
<link rel="manifest" href="/manifest.json">

<!-- iOS图标 -->
<link rel="apple-touch-icon" href="/icon-192.png">
```

#### 2. Web App Manifest (public/manifest.json)
```json
{
  "name": "智糖管家AI - 糖尿病营养管理",
  "short_name": "智糖管家",
  "description": "专业的糖尿病营养管理AI助手，智能饮食规划，科学血糖管理",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#2E7D32",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### 3. 全屏移动端CSS (index.css)
```css
/* 移除浏览器默认样式，实现全屏 */
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
}

body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  overscroll-behavior: none; /* 防止橡皮筋效果 */
}

#root {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 强制移除max-width限制 */
.container, .max-w-md, .mx-auto {
  max-width: 100% !important;
  width: 100% !important;
}

/* iOS刘海屏适配 */
@supports (padding: max(0px)) {
  body {
    padding-top: max(0px, env(safe-area-inset-top));
    padding-bottom: max(0px, env(safe-area-inset-bottom));
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
```

#### 4. React Layout组件修改 (App.tsx)
```tsx
// 移除了max-w-md限制
<div className="w-full bg-white min-h-screen shadow-xl relative flex flex-col">
  {/* 内容 */}
</div>
```

#### 5. Vite服务器配置 (vite.config.ts)
```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'ypgcihlwutgw.sealoshzh.site',  // 3000端口域名
      'xbpnaciwyekd.sealoshzh.site',  // 3001端口域名
    ],
  },
});
```

### 未来PWA增强计划

- [ ] Service Worker实现离线功能
- [ ] 缓存策略优化（Cache-First / Network-First）
- [ ] 后台数据同步
- [ ] 推送通知功能
- [ ] 应用更新提示
- [ ] 安装引导弹窗（BeforeInstallPrompt事件）

---

## 📞 支持与反馈

### 遇到问题？
1. 查看上方"故障排除"章节
2. 确保浏览器版本是最新的
3. 尝试清除缓存并重新安装

### 反馈渠道
- GitHub Issues: [项目地址]
- 邮箱: support@sugarsmart-ai.com（示例）
- 微信公众号: 智糖管家AI（示例）

---

## 📝 更新日志

### v1.0.0 (2025-12-01)
- ✅ 完成PWA基础配置
- ✅ 实现全屏显示
- ✅ iOS刘海屏适配
- ✅ Android Standalone模式
- ⏳ 待补充应用图标文件

---

**祝您使用愉快！💚**

让智糖管家AI陪伴您的健康管理之旅 🌟

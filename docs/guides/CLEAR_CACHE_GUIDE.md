# 🧹 清除缓存指南

## 问题：浏览器显示旧的假数据

即使后端API正常返回真实数据（包含AI图片），前端可能显示的是localStorage中缓存的旧数据。

---

## 解决方案1：浏览器手动清除（推荐）

### Chrome/Edge
1. 打开App页面 (http://localhost:5174)
2. 按 `F12` 打开开发者工具
3. 切换到 `Application` (应用) 标签
4. 左侧点击 `Local Storage` → `http://localhost:5174`
5. 右键点击 → 选择 `Clear` (清除)
6. 刷新页面 (`Ctrl+Shift+R` 强制刷新)

### Firefox
1. 打开App页面
2. 按 `F12` 打开开发者工具
3. 切换到 `Storage` (存储) 标签
4. 左侧点击 `Local Storage` → `http://localhost:5174`
5. 右键点击 → 选择 `Delete All` (删除全部)
6. 刷新页面 (`Ctrl+Shift+R`)

---

## 解决方案2：控制台命令清除

打开浏览器控制台 (F12 → Console)，输入：

```javascript
// 清除所有localStorage数据
localStorage.clear();

// 然后刷新页面
location.reload();
```

---

## 解决方案3：在代码中添加缓存版本控制

为了自动清除旧缓存，我们可以在App中添加版本检查。

### 临时方案：
在控制台执行清除指定缓存：
```javascript
localStorage.removeItem('meal_plan');
localStorage.removeItem('savedRecipes');
location.reload();
```

---

## 验证是否清除成功

清除后，在控制台输入：
```javascript
console.log('MealPlan:', localStorage.getItem('meal_plan'));
console.log('SavedRecipes:', localStorage.getItem('savedRecipes'));
```

应该显示 `null` 表示清除成功。

---

## 完整测试流程

1. **清除缓存**
   ```javascript
   localStorage.clear();
   ```

2. **重新登录**
   - 访问 http://localhost:5174
   - 注册新账号或登录

3. **生成新计划**
   - 完善健康档案
   - 点击"生成饮食计划"
   - 等待15-20秒

4. **验证图片**
   - 查看食谱卡片
   - 应该能看到AI生成的真实美食图片
   - 图片URL应该以 `https://ark-content-generation...` 开头

5. **检查控制台**
   ```javascript
   // 查看当前缓存的数据
   const plan = JSON.parse(localStorage.getItem('meal_plan') || '[]');
   console.log('食谱数量:', plan.length);
   console.log('第一个食谱:', plan[0]);
   console.log('图片URL:', plan[0]?.imageUrl);
   ```

---

## 如果还是显示假数据

检查以下内容：

### 1. 确认API配置
```bash
cat packages/app/.env
```
应该看到：
```
VITE_API_BASE_URL=https://jyrslunpgmyn.sealoshzh.site
VITE_MOCK_MODE=false
```

### 2. 确认服务运行
```bash
pm2 status
```
所有服务应该是 `online`

### 3. 测试API直接调用
```bash
./test-full-flow.sh
```
应该返回包含imageUrl的食谱数据

### 4. 检查网络请求
打开浏览器开发者工具 → Network标签
- 生成计划时应该看到对 `/api/meal-plan/generate` 的请求
- 查看Response，确认包含imageUrl字段

---

## 常见问题

### Q: 清除后还是显示假数据？
A: 可能是前端代码还在使用旧的RecipeCard组件。确保已经重启了前端服务：
```bash
pm2 restart sugarsmart-app
```

### Q: 图片显示不出来？
A: 检查RecipeCard组件是否正确使用imageUrl：
```javascript
// 在控制台检查
const recipe = JSON.parse(localStorage.getItem('meal_plan'))[0];
console.log('Recipe imageUrl:', recipe.imageUrl);
```

### Q: API返回的数据里有imageUrl，但前端不显示？
A: 检查RecipeCard.tsx是否已更新：
```bash
grep -n "imageUrl" packages/shared/src/components/RecipeCard.tsx
```
应该看到使用imageUrl的代码。

---

## 🎯 快速解决命令

在浏览器控制台一键执行：
```javascript
// 清除缓存并重新加载
localStorage.clear(); 
sessionStorage.clear(); 
location.reload(true);
```

---

**更新时间**: 2025-12-09  
**状态**: ✅ 已验证RecipeCard组件修复，需清除缓存

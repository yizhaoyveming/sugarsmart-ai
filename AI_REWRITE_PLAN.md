# 🔄 AI功能完全重写计划

## 📋 当前问题
- 控制台报错
- 图片显示问题
- 代码复杂，难以调试

## 🎯 重写目标
创建一个**极简、可靠、易调试**的AI服务

## 🔧 重写策略

### 1. Backend AI服务（核心）
**文件**: `packages/backend/src/services/ai.service.ts`

**新设计**:
```typescript
// 极简设计，只保留核心功能
export async function generateMealPlan(profile) {
  // 1. 调用Gemini生成食谱文本
  // 2. 为每个食谱调用豆包生成图片
  // 3. 组合返回
  // 4. 错误处理清晰明确
}
```

**关键改进**:
- ✅ 去除所有复杂逻辑
- ✅ 同步生成（先文本后图片）
- ✅ 详细日志输出
- ✅ 明确的错误处理

### 2. 图片生成服务
**文件**: `packages/backend/src/services/image.service.ts`

**保持简单**:
```typescript
export async function generateImage(recipeName: string): Promise<string> {
  // 直接调用豆包API
  // 返回图片URL
  // 不做任何复杂处理
}
```

### 3. 前端集成
**文件**: `packages/app/services/apiClient.ts`

**确保**:
- ✅ 移除所有mock逻辑
- ✅ 直接调用后端API
- ✅ 清晰的错误提示

## 📝 实施步骤

1. **备份当前代码** ✅ (已git commit)
2. **重写backend/ai.service.ts**
3. **简化image.service.ts**
4. **清理前端apiClient**
5. **测试验证**
6. **提交代码**

## 🧪 测试要点

- 生成3个食谱（早中晚）
- 每个食谱包含imageUrl
- 图片URL有效
- 前端正确显示

## ⏱️ 预计时间
20分钟

---

**开始时间**: 2025-12-09 06:58
**状态**: 🟡 进行中

# 智糖管家AI - 后端API需求文档

## 文档信息
- **版本**: v1.0.0
- **更新时间**: 2025-12-01
- **负责人**: 前端开发团队
- **目标读者**: 后端开发团队

---

## 概述

本文档定义了"智糖管家AI"应用前后端交互所需的所有API接口规范。前端已实现统一的API服务层（`services/apiClient.ts`），支持Mock模式和真实API模式的无缝切换。

### 技术要求
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **认证方式**: JWT Bearer Token
- **Base URL**: `http://localhost:3000/api` (开发环境)

---

## 通用规范

### 1. 请求头 (Request Headers)

```http
Content-Type: application/json
Authorization: Bearer {token}  # 需要认证的接口
```

### 2. 响应格式 (Response Format)

**成功响应**:
```json
{
  "success": true,
  "data": { ... }
}
```

**错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 3. 错误码定义

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| `AUTH_FAILED` | 401 | 认证失败（用户名或密码错误） |
| `TOKEN_EXPIRED` | 401 | Token已过期 |
| `TOKEN_INVALID` | 401 | Token无效 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `GENERATION_FAILED` | 500 | AI生成失败 |
| `NETWORK_ERROR` | 500 | 网络错误 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

---

## API接口清单

### 一、用户认证模块

#### 1.1 用户注册
- **接口**: `POST /api/auth/register`
- **认证**: 不需要
- **说明**: 创建新用户账号

**请求体**:
```json
{
  "username": "string (必填, 3-20字符)",
  "password": "string (必填, 6-20字符)",
  "nickname": "string (必填, 2-10字符)"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-12345",
      "username": "test_user",
      "nickname": "测试用户"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误示例**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "用户名已存在"
  }
}
```

---

#### 1.2 用户登录
- **接口**: `POST /api/auth/login`
- **认证**: 不需要
- **说明**: 用户登录获取Token

**请求体**:
```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-12345",
      "username": "test_user",
      "nickname": "测试用户"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 1.3 用户登出
- **接口**: `POST /api/auth/logout`
- **认证**: 需要 (Bearer Token)
- **说明**: 用户登出（可选实现，前端会清除本地Token）

**请求体**: 无

**成功响应** (200):
```json
{
  "success": true
}
```

---

### 二、用户档案管理

#### 2.1 获取用户档案
- **接口**: `GET /api/users/{userId}/profile`
- **认证**: 需要
- **说明**: 获取用户的健康档案信息

**路径参数**:
- `userId`: 用户ID (string)

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "age": 45,
    "height": 170,
    "weight": 75,
    "gender": "Male",
    "diabetesType": "Type 2",
    "fastingGlucose": "7.2",
    "medication": "二甲双胍 500mg",
    "stapleFood": ["米饭", "面条", "馒头"],
    "allergies": ["海鲜"],
    "mealsPerDay": 3,
    "specialRequests": "希望低盐低脂"
  }
}
```

---

#### 2.2 更新用户档案
- **接口**: `PUT /api/users/{userId}/profile`
- **认证**: 需要
- **说明**: 更新用户健康档案

**路径参数**:
- `userId`: 用户ID (string)

**请求体**:
```json
{
  "age": 45,
  "height": 170,
  "weight": 75,
  "gender": "Male",
  "diabetesType": "Type 2",
  "fastingGlucose": "7.2",
  "medication": "二甲双胍 500mg",
  "stapleFood": ["米饭", "面条"],
  "allergies": ["海鲜"],
  "mealsPerDay": 3,
  "specialRequests": "希望低盐低脂"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "age": 45,
    "height": 170,
    "weight": 75,
    ...
  }
}
```

---

### 三、饮食计划管理

#### 3.1 生成饮食计划
- **接口**: `POST /api/meal-plan/generate`
- **认证**: 需要
- **说明**: 基于用户档案生成个性化饮食计划

**请求体**:
```json
{
  "age": 45,
  "height": 170,
  "weight": 75,
  "gender": "Male",
  "diabetesType": "Type 2",
  "fastingGlucose": "7.2",
  "medication": "二甲双胍 500mg",
  "stapleFood": ["米饭", "面条"],
  "allergies": ["海鲜"],
  "mealsPerDay": 3,
  "specialRequests": "希望低盐低脂"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "recipe-breakfast-1",
      "name": "燕麦配浆果和杏仁",
      "mealType": "Breakfast",
      "time": "08:00",
      "description": "丰盛且富含纤维的早餐...",
      "ingredients": [
        { "name": "钢切燕麦", "amount": "1/2 杯" },
        { "name": "混合浆果", "amount": "1/2 杯" }
      ],
      "steps": [
        "在小锅中将杏仁奶煮至微沸。",
        "加入钢切燕麦，转小火。"
      ],
      "nutrition": {
        "calories": 320,
        "carbs": 42,
        "protein": 12,
        "fat": 11,
        "giLevel": "Low"
      },
      "tips": "钢切燕麦比速溶燕麦的血糖生成指数更低。"
    },
    {
      "id": "recipe-lunch-1",
      "name": "烤鸡肉藜麦沙拉",
      "mealType": "Lunch",
      "time": "12:30",
      ...
    },
    {
      "id": "recipe-dinner-1",
      "name": "烤三文鱼配蔬菜",
      "mealType": "Dinner",
      "time": "19:00",
      ...
    }
  ]
}
```

**注意事项**:
- 返回数组包含3个Recipe对象（早餐、午餐、晚餐）
- `giLevel` 枚举值: "Low" | "Medium" | "High"
- `mealType` 枚举值: "Breakfast" | "Lunch" | "Dinner" | "Snack"

---

#### 3.2 保存饮食计划
- **接口**: `POST /api/meal-plan`
- **认证**: 需要
- **说明**: 保存用户某日的饮食计划

**请求体**:
```json
{
  "userId": "user-12345",
  "date": "2025-12-01",
  "mealPlan": [
    {
      "id": "recipe-1",
      "name": "燕麦配浆果和杏仁",
      ...
    }
  ]
}
```

**成功响应** (200):
```json
{
  "success": true
}
```

---

#### 3.3 获取饮食计划
- **接口**: `GET /api/meal-plan/{date}?userId={userId}`
- **认证**: 需要
- **说明**: 获取用户某日的饮食计划

**路径参数**:
- `date`: 日期 (YYYY-MM-DD格式)

**查询参数**:
- `userId`: 用户ID

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "recipe-1",
      "name": "燕麦配浆果和杏仁",
      ...
    }
  ]
}
```

**错误响应** (404):
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "未找到该日期的饮食计划"
  }
}
```

---

#### 3.4 生成单个食谱
- **接口**: `POST /api/recipes/generate`
- **认证**: 需要
- **说明**: 为特定餐次生成单个食谱

**请求体**:
```json
{
  "profile": {
    "age": 45,
    "diabetesType": "Type 2",
    "allergies": ["海鲜"],
    "stapleFood": ["米饭"]
  },
  "mealType": "Breakfast"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "recipe-new-1",
    "name": "全麦面包配鸡蛋",
    "mealType": "Breakfast",
    "time": "08:00",
    ...
  }
}
```

---

### 四、血糖记录管理

#### 4.1 添加血糖记录
- **接口**: `POST /api/users/{userId}/glucose`
- **认证**: 需要
- **说明**: 添加新的血糖测量记录

**路径参数**:
- `userId`: 用户ID

**请求体**:
```json
{
  "date": "2025-12-01",
  "time": "08:00",
  "type": "fasting",
  "value": 6.8,
  "note": "空腹血糖"
}
```

**字段说明**:
- `type`: "fasting" | "postprandial" | "before-meal" | "bedtime"
- `value`: 血糖值 (mmol/L)

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "glucose-12345",
    "date": "2025-12-01",
    "time": "08:00",
    "type": "fasting",
    "value": 6.8,
    "note": "空腹血糖"
  }
}
```

---

#### 4.2 获取血糖历史记录
- **接口**: `GET /api/users/{userId}/glucose?startDate={start}&endDate={end}`
- **认证**: 需要
- **说明**: 获取指定时间范围的血糖记录

**路径参数**:
- `userId`: 用户ID

**查询参数**:
- `startDate`: 开始日期 (YYYY-MM-DD, 可选)
- `endDate`: 结束日期 (YYYY-MM-DD, 可选)

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "glucose-1",
      "date": "2025-12-01",
      "time": "08:00",
      "type": "fasting",
      "value": 6.8,
      "note": "空腹血糖"
    },
    {
      "id": "glucose-2",
      "date": "2025-12-01",
      "time": "10:00",
      "type": "postprandial",
      "value": 8.5,
      "note": "早餐后2小时"
    }
  ]
}
```

---

#### 4.3 删除血糖记录
- **接口**: `DELETE /api/users/{userId}/glucose/{recordId}`
- **认证**: 需要
- **说明**: 删除指定的血糖记录

**路径参数**:
- `userId`: 用户ID
- `recordId`: 血糖记录ID

**成功响应** (200):
```json
{
  "success": true
}
```

---

### 五、健康档案管理

#### 5.1 获取完整健康档案
- **接口**: `GET /api/users/{userId}/health-profile`
- **认证**: 需要
- **说明**: 获取用户的完整健康档案（包含血糖记录、用药、身体指标）

**路径参数**:
- `userId`: 用户ID

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "userId": "user-12345",
    "glucoseRecords": [
      {
        "id": "glucose-1",
        "date": "2025-12-01",
        "time": "08:00",
        "type": "fasting",
        "value": 6.8,
        "note": "空腹血糖"
      }
    ],
    "medications": [
      {
        "id": "med-1",
        "name": "二甲双胍",
        "dosage": "500mg",
        "frequency": "每日2次",
        "time": ["08:00", "18:00"],
        "startDate": "2025-01-01",
        "note": "餐后服用"
      }
    ],
    "bodyMetrics": [
      {
        "id": "metrics-1",
        "date": "2025-12-01",
        "weight": 75,
        "bmi": 25.95,
        "bloodPressure": {
          "systolic": 120,
          "diastolic": 80
        },
        "hba1c": 6.5
      }
    ],
    "lastUpdated": "2025-12-01T06:00:00Z"
  }
}
```

---

#### 5.2 更新身体指标
- **接口**: `POST /api/users/{userId}/body-metrics`
- **认证**: 需要
- **说明**: 添加新的身体指标记录

**路径参数**:
- `userId`: 用户ID

**请求体**:
```json
{
  "date": "2025-12-01",
  "weight": 75,
  "bmi": 25.95,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "bloodLipids": {
    "totalCholesterol": 5.2,
    "triglycerides": 1.5,
    "ldl": 3.0,
    "hdl": 1.2
  },
  "hba1c": 6.5
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "metrics-new-1",
    "date": "2025-12-01",
    "weight": 75,
    ...
  }
}
```

---

### 六、收藏管理

#### 6.1 添加收藏
- **接口**: `POST /api/users/{userId}/favorites`
- **认证**: 需要
- **说明**: 收藏食谱

**路径参数**:
- `userId`: 用户ID

**请求体**:
```json
{
  "recipeId": "recipe-12345"
}
```

**成功响应** (200):
```json
{
  "success": true
}
```

---

#### 6.2 取消收藏
- **接口**: `DELETE /api/users/{userId}/favorites/{recipeId}`
- **认证**: 需要
- **说明**: 取消收藏食谱

**路径参数**:
- `userId`: 用户ID
- `recipeId`: 食谱ID

**成功响应** (200):
```json
{
  "success": true
}
```

---

#### 6.3 获取收藏列表
- **接口**: `GET /api/users/{userId}/favorites`
- **认证**: 需要
- **说明**: 获取用户收藏的所有食谱ID列表

**路径参数**:
- `userId`: 用户ID

**成功响应** (200):
```json
{
  "success": true,
  "data": ["recipe-1", "recipe-2", "recipe-3"]
}
```

---

### 七、AI健康周报

#### 7.1 获取周报
- **接口**: `GET /api/users/{userId}/weekly-report?weekStart={date}`
- **认证**: 需要
- **说明**: 获取指定周的健康报告

**路径参数**:
- `userId`: 用户ID

**查询参数**:
- `weekStart`: 周开始日期 (YYYY-MM-DD)

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "report-1",
    "weekStart": "2025-11-25",
    "weekEnd": "2025-12-01",
    "bloodGlucoseSummary": {
      "avgFasting": 6.5,
      "avgPostprandial": 8.2,
      "stabilityScore": 85,
      "targetAchievement": true
    },
    "dietSummary": {
      "lowGIPercentage": 78,
      "avgCalories": 1650,
      "carbIntakeBalance": "medium",
      "topFoods": ["燕麦", "鸡胸肉", "西兰花"]
    },
    "exerciseSummary": {
      "daysExercised": 5,
      "totalCaloriesBurned": 1200,
      "favoriteActivities": ["快走", "瑜伽"]
    },
    "overallScore": 82,
    "highlights": ["血糖控制稳定", "饮食结构合理"],
    "nextWeekGoals": ["继续保持低GI饮食", "增加有氧运动"],
    "aiInsights": "本周表现优秀，血糖控制达标率95%...",
    "generatedAt": "2025-12-01T06:00:00Z"
  }
}
```

---

#### 7.2 生成周报
- **接口**: `POST /api/users/{userId}/weekly-report/generate`
- **认证**: 需要
- **说明**: 为指定周生成AI健康报告

**路径参数**:
- `userId`: 用户ID

**请求体**:
```json
{
  "weekStart": "2025-11-25"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": "report-new-1",
    "weekStart": "2025-11-25",
    ...
  }
}
```

---

### 八、帮助中心

#### 8.1 获取FAQ列表
- **接口**: `GET /api/faqs?category={category}`
- **认证**: 不需要
- **说明**: 获取常见问题列表

**查询参数**:
- `category`: 分类 (可选) - "account" | "diet" | "glucose" | "technical"

**成功响应** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "faq-1",
      "category": "account",
      "question": "如何注册账号？",
      "answer": "点击首页的"注册"按钮，填写用户名、密码和昵称即可完成注册。"
    },
    {
      "id": "faq-2",
      "category": "diet",
      "question": "如何生成饮食计划？",
      "answer": "完善您的个人档案后，系统会自动为您生成个性化的饮食计划。"
    }
  ]
}
```

---

#### 8.2 获取联系方式
- **接口**: `GET /api/contact`
- **认证**: 不需要
- **说明**: 获取客服联系方式

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "qq": "123456789",
    "wechat": "sugarsmart_ai",
    "email": "support@sugarsmart.ai"
  }
}
```

---

## 数据库设计建议

### 核心表结构

#### 1. users (用户表)
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. user_profiles (用户档案表)
```sql
CREATE TABLE user_profiles (
  user_id VARCHAR(50) PRIMARY KEY,
  age INT,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  gender ENUM('Male', 'Female'),
  diabetes_type ENUM('Type 1', 'Type 2', 'Pre-diabetes', 'Gestational'),
  fasting_glucose VARCHAR(10),
  medication TEXT,
  staple_food JSON,
  allergies JSON,
  meals_per_day INT,
  special_requests TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 3. recipes (食谱表)
```sql
CREATE TABLE recipes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  meal_type ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack'),
  description TEXT,
  ingredients JSON,
  steps JSON,
  nutrition JSON,
  tips TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. meal_plans (饮食计划表)
```sql
CREATE TABLE meal_plans (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  plan_date DATE,
  recipes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY (user_id, plan_date)
);
```

#### 5. glucose_records (血糖记录表)
```sql
CREATE TABLE glucose_records (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  record_date DATE,
  record_time TIME,
  type ENUM('fasting', 'postprandial', 'before-meal', 'bedtime'),
  value DECIMAL(4,1),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 6. favorites (收藏表)
```sql
CREATE TABLE favorites (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  recipe_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY (user_id, recipe_id)
);
```

---

## 前端集成示例

### 使用API客户端

```typescript
import { api } from './services/apiClient';

// 1. 用户登录
const loginUser = async () => {
  const response = await api.login({
    username: 'test',
    password: 'test123'
  });
  
  if (response.success) {
    console.log('登录成功:', response.data);
  } else {
    console.error('登录失败:', response.error);
  }
};

// 2. 生成饮食计划
const generatePlan = async (userProfile) => {
  const response = await api.generateMealPlan(userProfile);
  
  if (response.success) {
    setMealPlan(response.data);
  }
};

// 3. 添加血糖记录
const addGlucose = async (userId) => {
  const response = await api.addGlucoseRecord(userId, {
    date: '2025-12-01',
    time: '08:00',
    type: 'fasting',
    value: 6.8,
    note: '空腹血糖'
  });
};
```

---

## 测试建议

### 1. Postman Collection

建议后端团队提供Postman Collection，包含所有接口的测试用例和示例数据。

### 2. Mock Server

前端已实现完整的Mock模式，可在后端未就绪时进行开发和测试。

### 3. 环境配置

```env
# 开发环境
VITE_API_BASE_URL=http://localhost:3000
VITE_MOCK_MODE=false  # 切换为false使用真实API

# 生产环境
VITE_API_BASE_URL=https://api.sugarsmart.ai
VITE_MOCK_MODE=false
```

---

## 联调流程

1. **接口对齐**: 后端实现接口，提供Swagger文档
2. **数据格式确认**: 确保响应数据格式符合前端类型定义
3. **错误处理测试**: 测试各种错误场景的响应
4. **性能优化**: 根据实际使用情况优化接口性能
5. **安全性测试**: Token验证、数据加密等

---

## 附录

### TypeScript类型定义参考

详见前端项目 `types.ts` 文件，包含所有数据结构的完整类型定义。

### 关键枚举类型

```typescript
export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum DiabetesType {
  Type1 = 'Type 1',
  Type2 = 'Type 2',
  Prediabetes = 'Pre-diabetes',
  Gestational = 'Gestational',
}

export type GILevel = 'Low' | 'Medium' | 'High';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
export type GlucoseType = 'fasting' | 'postprandial' | 'before-meal' | 'bedtime';
```

---

## 联系方式

- **前端负责人**: [待填写]
- **后端负责人**: [待填写]
- **项目仓库**: [待填写]
- **文档更新**: 请在修改API时及时更新本文档

---

**文档版本**: v1.0.0  
**最后更新**: 2025-12-01

# App端真实API改造方案

## 📋 当前状态总结

### ✅ 已完成
1. **geminiService.ts** - Mock模式已修复，现在读取环境变量 `VITE_MOCK_MODE`
2. **AuthPage.tsx** - 登录注册页面已创建完成
3. **.env配置** - 已正确配置API地址和Mock模式为false

### ❌ 待完成
**App.tsx大规模重构** - 这是最核心的改造

---

## 🎯 App.tsx改造目标

将App端从**本地Mock数据**切换到**真实后端API**，包括：
1. 添加用户认证系统
2. 所有数据操作改为调用后端API
3. 移除localStorage作为主存储
4. 添加路由保护和错误处理

---

## 📝 详细改造计划

### **Part 1: 添加认证Context**

#### 1.1 在AppContext中新增认证相关状态
```typescript
interface AppContextType {
  // 新增 - 认证相关
  isAuthenticated: boolean;
  currentUser: {
    id: string;
    username: string;
    nickname: string;
  } | null;
  token: string | null;
  login: (userId: string, username: string, nickname: string, token: string) => void;
  logout: () => void;
  
  // 现有状态保持不变
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  mealPlan: MealPlan | null;
  setMealPlan: (plan: MealPlan) => void;
  savedRecipes: Recipe[];
  toggleSaveRecipe: (recipe: Recipe) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
  addRecipeToPlan: (recipe: Recipe) => void;
  updateRecipeInPlan: (updatedRecipe: Recipe) => void;
  removeRecipeFromPlan: (recipeId: string) => void;
  glucoseRecords: BloodGlucoseRecord[];
  addGlucoseRecord: (record: Omit<BloodGlucoseRecord, 'id'>) => void;
  deleteGlucoseRecord: (id: string) => void;
}
```

#### 1.2 修改localStorage存储键
```typescript
const STORAGE_KEYS = {
  VERSION: 'sugarsmart_version',
  // 新增 - 认证相关
  AUTH_TOKEN: 'sugarsmart_auth_token',
  CURRENT_USER: 'sugarsmart_current_user',
  // 保留作为缓存
  USER_PROFILE: 'sugarsmart_user_profile_cache',
  MEAL_PLAN: 'sugarsmart_meal_plan_cache',
  SAVED_RECIPES: 'sugarsmart_saved_recipes_cache',
  GLUCOSE_RECORDS: 'sugarsmart_glucose_records_cache'
};
```

---

### **Part 2: AppProvider改造**

#### 2.1 初始化认证状态
```typescript
// 从localStorage恢复认证状态
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
});

const [currentUser, setCurrentUser] = useState<{
  id: string;
  username: string;
  nickname: string;
} | null>(() => {
  const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return saved ? JSON.parse(saved) : null;
});

const [token, setToken] = useState<string | null>(() => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
});
```

#### 2.2 登录方法
```typescript
const login = (userId: string, username: string, nickname: string, authToken: string) => {
  setCurrentUser({ id: userId, username, nickname });
  setToken(authToken);
  setIsAuthenticated(true);
  
  // 保存到localStorage
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ id: userId, username, nickname }));
  
  // 登录后加载用户数据
  loadUserData(userId);
};
```

#### 2.3 登出方法
```typescript
const logout = async () => {
  // 调用后端登出API
  await api.logout();
  
  // 清除认证状态
  setCurrentUser(null);
  setToken(null);
  setIsAuthenticated(false);
  
  // 清除所有缓存
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.MEAL_PLAN);
  localStorage.removeItem(STORAGE_KEYS.SAVED_RECIPES);
  localStorage.removeItem(STORAGE_KEYS.GLUCOSE_RECORDS);
  
  // 重置状态
  setUserProfile(null);
  setMealPlan(null);
  setSavedRecipes([]);
  setGlucoseRecords([]);
};
```

#### 2.4 加载用户数据方法
```typescript
const loadUserData = async (userId: string) => {
  try {
    // 1. 加载用户档案
    const profileResponse = await api.getUserProfile(userId);
    if (profileResponse.success && profileResponse.data) {
      setUserProfile(profileResponse.data);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profileResponse.data));
    }
    
    // 2. 加载今日饮食计划
    const today = new Date().toISOString().split('T')[0];
    const mealPlanResponse = await api.getMealPlan(userId, today);
    if (mealPlanResponse.success && mealPlanResponse.data) {
      setMealPlan(mealPlanResponse.data);
      localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(mealPlanResponse.data));
    }
    
    // 3. 加载血糖记录（最近30天）
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const glucoseResponse = await api.getGlucoseHistory(
      userId,
      startDate.toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );
    if (glucoseResponse.success && glucoseResponse.data) {
      setGlucoseRecords(glucoseResponse.data);
      localStorage.setItem(STORAGE_KEYS.GLUCOSE_RECORDS, JSON.stringify(glucoseResponse.data));
    }
    
    // 4. 加载收藏列表
    const favoritesResponse = await api.getFavorites(userId);
    if (favoritesResponse.success && favoritesResponse.data) {
      // favoriteIds转换为Recipe对象（需要额外逻辑）
      // TODO: 实现收藏列表恢复
    }
  } catch (error) {
    console.error('加载用户数据失败:', error);
  }
};
```

---

### **Part 3: 数据操作方法改造**

#### 3.1 用户档案更新
```typescript
// 原来：直接保存到localStorage
const setUserProfile = (profile: UserProfile) => {
  setUserProfileState(profile);
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

// 改为：保存到后端
const setUserProfile = async (profile: UserProfile) => {
  if (!currentUser) return;
  
  setUserProfileState(profile);
  
  try {
    const response = await api.updateUserProfile(currentUser.id, profile);
    if (response.success) {
      // 成功后更新缓存
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } else {
      console.error('保存用户档案失败:', response.error);
      // TODO: 显示错误提示
    }
  } catch (error) {
    console.error('保存用户档案失败:', error);
  }
};
```

#### 3.2 饮食计划生成
```typescript
// InputPage.tsx 中的 handleSubmit
const handleSubmit = async () => {
  if (!validateStep2()) return;
  if (!currentUser) return; // 需要登录
  
  setUserProfile(formData);
  setIsGenerating(true);
  navigate('/result');
  
  try {
    // 调用后端API生成饮食计划
    const response = await api.generateMealPlan(formData);
    
    if (response.success && response.data) {
      setMealPlan(response.data);
      
      // 保存到后端
      const today = new Date().toISOString().split('T')[0];
      await api.saveMealPlan(currentUser.id, today, response.data);
    } else {
      alert("生成饮食计划失败: " + (response.error?.message || '未知错误'));
      navigate('/input');
    }
  } catch (error) {
    console.error(error);
    alert("生成饮食计划失败，请重试");
    navigate('/input');
  } finally {
    setIsGenerating(false);
  }
};
```

#### 3.3 血糖记录管理
```typescript
// 添加血糖记录
const addGlucoseRecord = async (record: Omit<BloodGlucoseRecord, 'id'>) => {
  if (!currentUser) return;
  
  try {
    const response = await api.addGlucoseRecord(currentUser.id, record);
    
    if (response.success && response.data) {
      // 更新本地状态
      setGlucoseRecords(prev => [...prev, response.data!]);
      // 更新缓存
      const updated = [...glucoseRecords, response.data];
      localStorage.setItem(STORAGE_KEYS.GLUCOSE_RECORDS, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('添加血糖记录失败:', error);
  }
};

// 删除血糖记录
const deleteGlucoseRecord = async (id: string) => {
  if (!currentUser) return;
  
  try {
    const response = await api.deleteGlucoseRecord(currentUser.id, id);
    
    if (response.success) {
      // 更新本地状态
      setGlucoseRecords(prev => prev.filter(r => r.id !== id));
      // 更新缓存
      const updated = glucoseRecords.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.GLUCOSE_RECORDS, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('删除血糖记录失败:', error);
  }
};
```

#### 3.4 收藏功能
```typescript
// 切换收藏状态
const toggleSaveRecipe = async (recipe: Recipe) => {
  if (!currentUser) return;
  
  const exists = savedRecipes.find(r => r.name === recipe.name);
  
  try {
    if (exists) {
      // 取消收藏
      await api.removeFavorite(currentUser.id, recipe.id || recipe.name);
      setSavedRecipes(prev => prev.filter(r => r.name !== recipe.name));
    } else {
      // 添加收藏
      await api.addFavorite(currentUser.id, recipe.id || recipe.name);
      setSavedRecipes(prev => [...prev, recipe]);
    }
    
    // 更新缓存
    localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(savedRecipes));
  } catch (error) {
    console.error('收藏操作失败:', error);
  }
};
```

---

### **Part 4: 路由改造**

#### 4.1 添加AuthPage路由
```typescript
// App.tsx 的 Routes 部分
<Routes>
  {/* 未登录：显示认证页 */}
  {!isAuthenticated && (
    <Route path="/*" element={
      <AuthPage onAuthSuccess={(userId, username, nickname, token) => {
        login(userId, username, nickname, token);
      }} />
    } />
  )}
  
  {/* 已登录：显示正常应用 */}
  {isAuthenticated && (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/input" element={<InputPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/detail" element={<DetailPage />} />
      <Route path="/data" element={<DataPageRoute />} />
      <Route path="/mine" element={<MinePage />} />
      <Route path="/help-center" element={<HelpCenter onBack={() => window.history.back()} />} />
    </>
  )}
</Routes>
```

#### 4.2 修改Layout组件
```typescript
// Layout 中的导航栏显示逻辑
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAppContext();
  
  // 只在已登录且在特定页面时显示导航栏
  const showNav = isAuthenticated && ['/home', '/result', '/data', '/mine'].includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full bg-white min-h-screen shadow-xl relative flex flex-col">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          {children}
        </main>
        
        {showNav && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] flex justify-around py-3 px-1 z-50">
            {/* 导航项 */}
          </nav>
        )}
      </div>
    </div>
  );
};
```

---

### **Part 5: MinePage改造**

#### 5.1 添加登出按钮
```typescript
const MinePage: React.FC = () => {
  const { userProfile, savedRecipes, toggleSaveRecipe, logout, currentUser } = useAppContext();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();
      navigate('/');
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 用户资料头部 */}
      <div className="bg-white p-6 pb-10 rounded-b-[30px] shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-green">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{currentUser?.nickname || '用户'}</h2>
            <p className="text-sm text-gray-500">@{currentUser?.username}</p>
          </div>
          {/* 登出按钮 */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
        
        {/* 其余内容保持不变 */}
      </div>
      
      {/* ... */}
    </div>
  );
};
```

---

### **Part 6: 错误处理**

#### 6.1 Token过期处理
```typescript
// 在AppProvider中监听API错误
useEffect(() => {
  // 可以创建一个全局错误监听器
  const handleApiError = (error: any) => {
    if (error?.code === 'HTTP_401' || error?.message?.includes('Unauthorized')) {
      // Token过期，自动登出
      console.log('Token过期，自动退出登录');
      logout();
    }
  };
  
  // TODO: 实现全局错误监听
}, []);
```

#### 6.2 网络错误提示
```typescript
// 在各个API调用处添加错误提示
try {
  const response = await api.someMethod();
  if (!response.success) {
    // 显示错误提示
    showToast(response.error?.message || '操作失败', 'error');
  }
} catch (error) {
  showToast('网络错误，请检查连接', 'error');
}
```

---

## 🔧 需要修改的具体位置

### App.tsx文件
| 行数范围 | 修改内容 | 类型 |
|---------|---------|------|
| 30-50 | AppContextType接口 | 新增认证相关字段 |
| 200-250 | AppProvider状态初始化 | 新增认证状态 |
| 250-300 | login/logout方法 | 新增 |
| 300-350 | loadUserData方法 | 新增 |
| 350-450 | 数据操作方法改造 | 修改为调用API |
| 900-950 | Routes配置 | 添加认证路由保护 |
| 400-450 | InputPage handleSubmit | 改为调用API |
| 750-800 | ResultPage 生成逻辑 | 改为调用API |
| 950-1000 | MinePage | 添加登出功能 |

### 其他文件
| 文件 | 修改内容 |
|------|---------|
| packages/app/pages/DataPage.tsx | 可能需要传入currentUser |
| packages/app/pages/GlucoseTracking.tsx | 使用API的血糖记录方法 |

---

## ⚠️ 重要注意事项

### 1. 数据迁移
**问题**：现有用户localStorage中已有数据  
**方案**：
- 选项A：清空所有localStorage，重新开始
- 选项B：首次登录后，检测localStorage数据，上传到后端

### 2. 离线功能
**影响**：改造后必须联网使用  
**建议**：如需离线支持，保留localStorage作为缓存，添加同步机制

### 3. 错误处理
**必须实现**：
- Token过期自动登出
- 网络错误提示
- API失败重试机制

### 4. 性能优化
**建议**：
- 添加loading状态
- 实现数据预加载
- 使用缓存减少API调用

---

## 📊 改造工作量评估

| 任务 | 预估时间 | 复杂度 |
|------|---------|-------|
| 添加认证Context | 30分钟 | 中 |
| 改造AppProvider | 1小时 | 高 |
| 数据操作方法改造 | 1.5小时 | 高 |
| 路由改造 | 30分钟 | 中 |
| MinePage改造 | 20分钟 | 低 |
| 错误处理 | 40分钟 | 中 |
| 测试调试 | 1小时 | 高 |
| **总计** | **约5小时** | **高** |

---

## ✅ 验收标准

改造完成后应满足：

1. ✅ 打开App显示登录页面
2. ✅ 可以注册新用户
3. ✅ 可以登录已有用户
4. ✅ 登录后显示正常应用界面
5. ✅ 填写健康档案后保存到后端
6. ✅ 生成饮食计划调用后端AI API
7. ✅ 添加血糖记录保存到后端
8. ✅ 收藏功能保存到后端
9. ✅ 退出登录清除所有状态
10. ✅ Token过期自动跳转登录
11. ✅ 网络错误有友好提示

---

## 🚀 后续优化建议

改造完成后可以考虑：

1. **数据预加载** - 登录时批量加载所有数据
2. **缓存策略** - 合理使用localStorage减少API调用
3. **离线支持** - 实现离线缓存和数据同步
4. **性能优化** - 添加请求节流、防抖
5. **用户体验** - 添加更多loading和骨架屏
6. **错误恢复** - 实现自动重试和错误恢复机制

---

**文档创建时间**: 2025-12-06  
**适用版本**: App v1.0.0  
**后端API版本**: v1.0.0

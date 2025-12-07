/**
 * 智糖管家AI - 统一API服务层
 * 
 * 功能：
 * 1. 统一管理所有API请求
 * 2. 支持Mock模式和真实API模式切换
 * 3. 提供完整的类型定义
 * 4. 统一的错误处理
 */

import {
  UserProfile,
  MealPlan,
  Recipe,
  BloodGlucoseRecord,
  BodyMetrics,
  HealthProfile,
  WeeklyReport,
  FAQ,
  ContactInfo
} from '@sugarsmart/shared';

// ==================== 类型定义 ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    nickname: string;
  };
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ==================== Mock数据 ====================

const MOCK_USER_PROFILE: UserProfile = {
  age: 45,
  height: 170,
  weight: 75,
  gender: 'Male' as any,
  diabetesType: 'Type 2' as any,
  fastingGlucose: '7.2',
  medication: '二甲双胍 500mg',
  stapleFood: ['米饭', '面条', '馒头'],
  allergies: ['海鲜'],
  mealsPerDay: 3,
  specialRequests: '希望低盐低脂'
};

const MOCK_GLUCOSE_RECORDS: BloodGlucoseRecord[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    type: 'fasting',
    value: 6.8,
    note: '空腹血糖'
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'postprandial',
    value: 8.5,
    note: '早餐后2小时'
  }
];

const MOCK_WEEKLY_REPORT: WeeklyReport = {
  id: '1',
  weekStart: '2025-11-25',
  weekEnd: '2025-12-01',
  bloodGlucoseSummary: {
    avgFasting: 6.5,
    avgPostprandial: 8.2,
    stabilityScore: 85,
    targetAchievement: true
  },
  dietSummary: {
    lowGIPercentage: 78,
    avgCalories: 1650,
    carbIntakeBalance: 'medium',
    topFoods: ['燕麦', '鸡胸肉', '西兰花']
  },
  exerciseSummary: {
    daysExercised: 5,
    totalCaloriesBurned: 1200,
    favoriteActivities: ['快走', '瑜伽']
  },
  overallScore: 82,
  highlights: ['血糖控制稳定', '饮食结构合理', '运动量充足'],
  nextWeekGoals: ['继续保持低GI饮食', '增加有氧运动时间'],
  aiInsights: '本周表现优秀，血糖控制达标率95%。建议继续保持当前的饮食和运动习惯。',
  generatedAt: new Date().toISOString()
};

// ==================== API客户端类 ====================

class ApiClient {
  private baseURL: string;
  private mockMode: boolean;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    this.mockMode = import.meta.env.VITE_MOCK_MODE === 'true';
    
    // 从localStorage加载token
    this.token = localStorage.getItem('auth_token');
  }

  // ==================== 私有方法 ====================

  private async mockDelay(ms: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * 将英文错误消息翻译为中文
   */
  private translateErrorMessage(englishMessage: string, statusCode?: number): string {
    // 常见错误消息映射
    const errorMap: { [key: string]: string } = {
      // 认证相关
      'Invalid credentials': '用户名或密码错误',
      'User not found': '用户不存在',
      'User already exists': '用户名已被使用',
      'Username already exists': '用户名已存在',
      'Invalid token': '登录已过期，请重新登录',
      'Token expired': '登录已过期，请重新登录',
      'Unauthorized': '未授权，请先登录',
      'Authentication required': '需要登录',
      
      // 验证相关
      'Validation failed': '数据验证失败',
      'Invalid input': '输入数据无效',
      'Missing required fields': '缺少必填字段',
      '缺少必填字段': '缺少必填字段',
      'Invalid email format': '邮箱格式不正确',
      'Password too short': '密码长度不足',
      'Username too short': '账号长度不足',
      'VALIDATION_ERROR': '数据验证失败',
      'USERNAME_EXISTS': '用户名已存在',
      
      // 资源相关
      'Not found': '未找到请求的资源',
      'Resource not found': '资源不存在',
      'Already exists': '资源已存在',
      
      // 权限相关
      'Forbidden': '无权访问',
      'Access denied': '访问被拒绝',
      
      // 服务器相关
      'Internal server error': '服务器内部错误',
      'Service unavailable': '服务暂时不可用',
      'Bad gateway': '网关错误',
    };

    // HTTP状态码默认消息
    const statusCodeMessages: { [key: number]: string } = {
      400: '请求参数错误',
      401: '未授权，请先登录',
      403: '无权访问',
      404: '请求的资源不存在',
      409: '数据冲突，请刷新后重试',
      422: '数据验证失败',
      429: '请求过于频繁，请稍后再试',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务暂时不可用',
      504: '网关超时',
    };

    // 1. 先尝试精确匹配错误消息
    if (errorMap[englishMessage]) {
      return errorMap[englishMessage];
    }

    // 2. 尝试部分匹配（不区分大小写）
    const lowerMessage = englishMessage.toLowerCase();
    for (const [key, value] of Object.entries(errorMap)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return value;
      }
    }

    // 3. 根据状态码返回默认消息
    if (statusCode && statusCodeMessages[statusCode]) {
      return statusCodeMessages[statusCode];
    }

    // 4. 如果都没匹配，返回原消息或通用错误
    return englishMessage || '操作失败，请重试';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // 翻译错误消息为中文
        const errorMessage = this.translateErrorMessage(
          data.message || data.error?.message || '',
          response.status
        );

        return {
          success: false,
          error: {
            code: data.error?.code || `HTTP_${response.status}`,
            message: errorMessage,
          },
        };
      }

      // 后端返回格式：{ success: true, data: {...} }
      // 直接返回后端的响应，不再包装
      if (data.success && data.data !== undefined) {
        return {
          success: true,
          data: data.data,
        };
      }

      // 如果后端没有按标准格式返回，直接包装
      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      // 网络错误也提供友好的中文提示
      let errorMessage = '网络连接失败，请检查网络后重试';
      
      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '无法连接到服务器，请检查网络连接';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = '网络错误，请稍后重试';
        }
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: errorMessage,
        },
      };
    }
  }

  // ==================== 用户认证 ====================

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    if (this.mockMode) {
      await this.mockDelay();
      
      // Mock验证逻辑
      if (credentials.username === 'test' && credentials.password === 'test123') {
        const mockAuth: AuthResponse = {
          user: {
            id: 'mock-user-1',
            username: credentials.username,
            nickname: '测试用户',
          },
          token: 'mock-token-' + Date.now(),
        };
        this.setToken(mockAuth.token);
        return { success: true, data: mockAuth };
      }
      
      return {
        success: false,
        error: { code: 'AUTH_FAILED', message: '用户名或密码错误' },
      };
    }

    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    if (this.mockMode) {
      await this.mockDelay();
      
      const mockAuth: AuthResponse = {
        user: {
          id: 'mock-user-' + Date.now(),
          username: userData.username,
          nickname: userData.nickname,
        },
        token: 'mock-token-' + Date.now(),
      };
      this.setToken(mockAuth.token);
      return { success: true, data: mockAuth };
    }

    const response = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
    
    if (!this.mockMode) {
      await this.request('/api/auth/logout', { method: 'POST' });
    }
  }

  // ==================== 用户档案管理 ====================

  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    if (this.mockMode) {
      await this.mockDelay();
      return { success: true, data: MOCK_USER_PROFILE };
    }

    return this.request<UserProfile>(`/api/users/${userId}/profile`);
  }

  async updateUserProfile(
    userId: string,
    profile: UserProfile
  ): Promise<ApiResponse<UserProfile>> {
    if (this.mockMode) {
      await this.mockDelay();
      return { success: true, data: profile };
    }

    return this.request<UserProfile>(`/api/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // ==================== 饮食计划管理 ====================

  async generateMealPlan(profile: UserProfile): Promise<ApiResponse<MealPlan>> {
    if (this.mockMode) {
      // 使用geminiService的mock数据
      const { generateMealPlan } = await import('./geminiService');
      try {
        const mealPlan = await generateMealPlan(profile);
        return { success: true, data: mealPlan };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GENERATION_FAILED',
            message: error instanceof Error ? error.message : '生成饮食计划失败',
          },
        };
      }
    }

    return this.request<MealPlan>('/api/meal-plan/generate', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async saveMealPlan(
    userId: string,
    date: string,
    mealPlan: MealPlan
  ): Promise<ApiResponse<void>> {
    if (this.mockMode) {
      await this.mockDelay();
      localStorage.setItem(`meal_plan_${userId}_${date}`, JSON.stringify(mealPlan));
      return { success: true };
    }

    return this.request<void>('/api/meal-plan', {
      method: 'POST',
      body: JSON.stringify({ userId, date, mealPlan }),
    });
  }

  async getMealPlan(userId: string, date: string): Promise<ApiResponse<MealPlan>> {
    if (this.mockMode) {
      await this.mockDelay();
      const stored = localStorage.getItem(`meal_plan_${userId}_${date}`);
      
      if (stored) {
        return { success: true, data: JSON.parse(stored) };
      }
      
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: '未找到该日期的饮食计划' },
      };
    }

    return this.request<MealPlan>(`/api/meal-plan/${date}?userId=${userId}`);
  }

  async generateSingleRecipe(
    profile: UserProfile,
    mealType: string
  ): Promise<ApiResponse<Recipe>> {
    if (this.mockMode) {
      const { generateSingleRecipe } = await import('./geminiService');
      try {
        const recipe = await generateSingleRecipe(profile, mealType);
        return { success: true, data: recipe };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'GENERATION_FAILED',
            message: error instanceof Error ? error.message : '生成食谱失败',
          },
        };
      }
    }

    return this.request<Recipe>('/api/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({ profile, mealType }),
    });
  }

  // ==================== 血糖记录管理 ====================

  async addGlucoseRecord(
    userId: string,
    record: Omit<BloodGlucoseRecord, 'id'>
  ): Promise<ApiResponse<BloodGlucoseRecord>> {
    if (this.mockMode) {
      await this.mockDelay();
      const newRecord: BloodGlucoseRecord = {
        ...record,
        id: 'mock-glucose-' + Date.now(),
      };
      return { success: true, data: newRecord };
    }

    return this.request<BloodGlucoseRecord>(`/api/users/${userId}/glucose`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async getGlucoseHistory(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<BloodGlucoseRecord[]>> {
    if (this.mockMode) {
      await this.mockDelay();
      return { success: true, data: MOCK_GLUCOSE_RECORDS };
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return this.request<BloodGlucoseRecord[]>(
      `/api/users/${userId}/glucose?${params}`
    );
  }

  async deleteGlucoseRecord(
    userId: string,
    recordId: string
  ): Promise<ApiResponse<void>> {
    if (this.mockMode) {
      await this.mockDelay();
      return { success: true };
    }

    return this.request<void>(`/api/users/${userId}/glucose/${recordId}`, {
      method: 'DELETE',
    });
  }

  // ==================== 健康档案管理 ====================

  async getHealthProfile(userId: string): Promise<ApiResponse<HealthProfile>> {
    if (this.mockMode) {
      await this.mockDelay();
      const mockProfile: HealthProfile = {
        userId,
        glucoseRecords: MOCK_GLUCOSE_RECORDS,
        medications: [],
        bodyMetrics: [],
        lastUpdated: new Date().toISOString(),
      };
      return { success: true, data: mockProfile };
    }

    return this.request<HealthProfile>(`/api/users/${userId}/health-profile`);
  }

  async updateBodyMetrics(
    userId: string,
    metrics: Omit<BodyMetrics, 'id'>
  ): Promise<ApiResponse<BodyMetrics>> {
    if (this.mockMode) {
      await this.mockDelay();
      const newMetrics: BodyMetrics = {
        ...metrics,
        id: 'mock-metrics-' + Date.now(),
      };
      return { success: true, data: newMetrics };
    }

    return this.request<BodyMetrics>(`/api/users/${userId}/body-metrics`, {
      method: 'POST',
      body: JSON.stringify(metrics),
    });
  }

  // ==================== 收藏管理 ====================

  async addFavorite(userId: string, recipeId: string): Promise<ApiResponse<void>> {
    if (this.mockMode) {
      await this.mockDelay();
      const favorites = JSON.parse(
        localStorage.getItem(`favorites_${userId}`) || '[]'
      );
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
      }
      return { success: true };
    }

    return this.request<void>(`/api/users/${userId}/favorites`, {
      method: 'POST',
      body: JSON.stringify({ recipeId }),
    });
  }

  async removeFavorite(userId: string, recipeId: string): Promise<ApiResponse<void>> {
    if (this.mockMode) {
      await this.mockDelay();
      const favorites = JSON.parse(
        localStorage.getItem(`favorites_${userId}`) || '[]'
      );
      const filtered = favorites.filter((id: string) => id !== recipeId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(filtered));
      return { success: true };
    }

    return this.request<void>(`/api/users/${userId}/favorites/${recipeId}`, {
      method: 'DELETE',
    });
  }

  async getFavorites(userId: string): Promise<ApiResponse<string[]>> {
    if (this.mockMode) {
      await this.mockDelay();
      const favorites = JSON.parse(
        localStorage.getItem(`favorites_${userId}`) || '[]'
      );
      return { success: true, data: favorites };
    }

    return this.request<string[]>(`/api/users/${userId}/favorites`);
  }

  // ==================== 周报管理 ====================

  async getWeeklyReport(
    userId: string,
    weekStart: string
  ): Promise<ApiResponse<WeeklyReport>> {
    if (this.mockMode) {
      await this.mockDelay();
      return { success: true, data: MOCK_WEEKLY_REPORT };
    }

    return this.request<WeeklyReport>(
      `/api/users/${userId}/weekly-report?weekStart=${weekStart}`
    );
  }

  async generateWeeklyReport(
    userId: string,
    weekStart: string
  ): Promise<ApiResponse<WeeklyReport>> {
    if (this.mockMode) {
      await this.mockDelay(1500);
      return { success: true, data: MOCK_WEEKLY_REPORT };
    }

    return this.request<WeeklyReport>(`/api/users/${userId}/weekly-report/generate`, {
      method: 'POST',
      body: JSON.stringify({ weekStart }),
    });
  }

  // ==================== 帮助中心 ====================

  async getFAQs(category?: string): Promise<ApiResponse<FAQ[]>> {
    if (this.mockMode) {
      await this.mockDelay();
      const mockFAQs: FAQ[] = [
        {
          id: '1',
          category: 'account',
          question: '如何注册账号？',
          answer: '点击首页的"注册"按钮，填写用户名、密码和昵称即可完成注册。',
        },
        {
          id: '2',
          category: 'diet',
          question: '如何生成饮食计划？',
          answer: '完善您的个人档案后，系统会自动为您生成个性化的饮食计划。',
        },
      ];
      return { success: true, data: mockFAQs };
    }

    const params = category ? `?category=${category}` : '';
    return this.request<FAQ[]>(`/api/faqs${params}`);
  }

  async getContactInfo(): Promise<ApiResponse<ContactInfo>> {
    if (this.mockMode) {
      await this.mockDelay();
      const mockContact: ContactInfo = {
        qq: '123456789',
        wechat: 'sugarsmart_ai',
        email: 'support@sugarsmart.ai',
      };
      return { success: true, data: mockContact };
    }

    return this.request<ContactInfo>('/api/contact');
  }
}

// ==================== 导出单例 ====================

export const apiClient = new ApiClient();

// 导出便捷方法
export const api = {
  // 认证
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  register: (userData: RegisterRequest) => apiClient.register(userData),
  logout: () => apiClient.logout(),

  // 用户档案
  getUserProfile: (userId: string) => apiClient.getUserProfile(userId),
  updateUserProfile: (userId: string, profile: UserProfile) =>
    apiClient.updateUserProfile(userId, profile),

  // 饮食计划
  generateMealPlan: (profile: UserProfile) => apiClient.generateMealPlan(profile),
  saveMealPlan: (userId: string, date: string, mealPlan: MealPlan) =>
    apiClient.saveMealPlan(userId, date, mealPlan),
  getMealPlan: (userId: string, date: string) =>
    apiClient.getMealPlan(userId, date),
  generateSingleRecipe: (profile: UserProfile, mealType: string) =>
    apiClient.generateSingleRecipe(profile, mealType),

  // 血糖记录
  addGlucoseRecord: (userId: string, record: Omit<BloodGlucoseRecord, 'id'>) =>
    apiClient.addGlucoseRecord(userId, record),
  getGlucoseHistory: (userId: string, startDate?: string, endDate?: string) =>
    apiClient.getGlucoseHistory(userId, startDate, endDate),
  deleteGlucoseRecord: (userId: string, recordId: string) =>
    apiClient.deleteGlucoseRecord(userId, recordId),

  // 健康档案
  getHealthProfile: (userId: string) => apiClient.getHealthProfile(userId),
  updateBodyMetrics: (userId: string, metrics: Omit<BodyMetrics, 'id'>) =>
    apiClient.updateBodyMetrics(userId, metrics),

  // 收藏
  addFavorite: (userId: string, recipeId: string) =>
    apiClient.addFavorite(userId, recipeId),
  removeFavorite: (userId: string, recipeId: string) =>
    apiClient.removeFavorite(userId, recipeId),
  getFavorites: (userId: string) => apiClient.getFavorites(userId),

  // 周报
  getWeeklyReport: (userId: string, weekStart: string) =>
    apiClient.getWeeklyReport(userId, weekStart),
  generateWeeklyReport: (userId: string, weekStart: string) =>
    apiClient.generateWeeklyReport(userId, weekStart),

  // 帮助
  getFAQs: (category?: string) => apiClient.getFAQs(category),
  getContactInfo: () => apiClient.getContactInfo(),
};

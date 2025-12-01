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

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  Light = 'Lightly Active',
  Moderate = 'Moderately Active',
  Very = 'Very Active',
}

export interface UserProfile {
  // Step 1: Basic
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: Gender;
  
  // Step 2: Diabetes
  diabetesType: DiabetesType;
  fastingGlucose: string; // mmol/L or mg/dL
  medication: string;
  
  // Step 3: Preferences
  stapleFood: string[];
  allergies: string[];
  mealsPerDay: number;
  specialRequests: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface NutritionInfo {
  calories: number;
  carbs: number; // g
  protein: number; // g
  fat: number; // g
  giLevel: 'Low' | 'Medium' | 'High';
}

export interface Recipe {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  time: string; // HH:MM format
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  nutrition: NutritionInfo;
  tips: string;
}

export type MealPlan = Recipe[];

// 新增：血糖记录
export interface BloodGlucoseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: 'fasting' | 'postprandial' | 'before-meal' | 'bedtime'; // 空腹/餐后/餐前/睡前
  value: number; // mmol/L
  note?: string;
}

// 新增：用药记录
export interface MedicationRecord {
  id: string;
  name: string; // 药物名称
  dosage: string; // 剂量
  frequency: string; // 频率（如：每日3次）
  time: string[]; // 服药时间 ["08:00", "12:00", "18:00"]
  startDate: string;
  endDate?: string;
  note?: string;
}

// 新增：身体指标记录
export interface BodyMetrics {
  id: string;
  date: string;
  weight?: number; // kg
  bmi?: number;
  bloodPressure?: {
    systolic: number; // 收缩压
    diastolic: number; // 舒张压
  };
  bloodLipids?: {
    totalCholesterol?: number; // 总胆固醇
    triglycerides?: number; // 甘油三酯
    ldl?: number; // 低密度脂蛋白
    hdl?: number; // 高密度脂蛋白
  };
  hba1c?: number; // 糖化血红蛋白
}

// 新增：健康档案
export interface HealthProfile {
  userId: string;
  glucoseRecords: BloodGlucoseRecord[];
  medications: MedicationRecord[];
  bodyMetrics: BodyMetrics[];
  lastUpdated: string;
}

// 新增：AI健康周报
export interface WeeklyReport {
  id: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  bloodGlucoseSummary: {
    avgFasting: number;
    avgPostprandial: number;
    stabilityScore: number; // 0-100
    targetAchievement: boolean;
  };
  dietSummary: {
    lowGIPercentage: number;
    avgCalories: number;
    carbIntakeBalance: 'low' | 'medium' | 'high';
    topFoods: string[];
  };
  exerciseSummary: {
    daysExercised: number;
    totalCaloriesBurned: number;
    favoriteActivities: string[];
  };
  overallScore: number; // 0-100
  highlights: string[];
  nextWeekGoals: string[];
  aiInsights: string;
  generatedAt: string;
}

// 新增：帮助中心FAQ
export interface FAQ {
  id: string;
  category: 'account' | 'diet' | 'glucose' | 'technical';
  question: string;
  answer: string;
}

// 新增：联系方式
export interface ContactInfo {
  qq?: string;
  wechat?: string;
  email?: string;
}

// 新增：分享内容
export interface ShareContent {
  type: 'meal-plan' | 'weekly-report' | 'glucose-chart';
  title: string;
  imageUrl?: string;
  shareUrl?: string;
  content: any;
}

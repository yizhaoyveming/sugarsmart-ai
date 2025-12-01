import { UserProfile, MealPlan, Gender } from '../types';

/**
 * 使用Harris-Benedict公式计算基础代谢率(BMR)和每日目标热量
 * BMR计算公式：
 * - 男性: BMR = 88.362 + (13.397 × 体重kg) + (4.799 × 身高cm) - (5.677 × 年龄)
 * - 女性: BMR = 447.593 + (9.247 × 体重kg) + (3.098 × 身高cm) - (4.330 × 年龄)
 * 
 * 每日总热量 = BMR × 活动系数
 * 活动系数：
 * - 久坐: 1.2
 * - 轻度活动: 1.375
 * - 中度活动: 1.55
 * - 高度活动: 1.725
 */
export const calculateDailyCalorieTarget = (profile: UserProfile, activityLevel: number = 1.375): number => {
  const { age, weight, height, gender } = profile;
  
  // 计算BMR (基础代谢率)
  let bmr: number;
  
  if (gender === Gender.Male) {
    // 男性公式
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    // 女性公式
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // 计算每日总热量需求
  const dailyCalories = bmr * activityLevel;
  
  // 四舍五入到整数
  return Math.round(dailyCalories);
};

/**
 * 计算已摄入的热量（基于meal plan中所有食谱的热量总和）
 * @param mealPlan 饮食计划数组
 * @returns 已摄入的总热量（千卡）
 */
export const calculateConsumedCalories = (mealPlan: MealPlan | null): number => {
  if (!mealPlan || mealPlan.length === 0) {
    return 0;
  }
  
  const totalCalories = mealPlan.reduce((sum, recipe) => {
    return sum + (recipe.nutrition.calories || 0);
  }, 0);
  
  return Math.round(totalCalories);
};

/**
 * 计算剩余可摄入热量
 * @param targetCalories 目标热量
 * @param consumedCalories 已摄入热量
 * @returns 剩余可摄入热量（不会小于0）
 */
export const calculateRemainingCalories = (targetCalories: number, consumedCalories: number): number => {
  const remaining = targetCalories - consumedCalories;
  // 确保不返回负数
  return Math.max(0, Math.round(remaining));
};

/**
 * 计算BMI（身体质量指数）
 * 公式：BMI = 体重(kg) / [身高(m)]²
 * @param height 身高（厘米）
 * @param weight 体重（千克）
 * @returns BMI值（保留1位小数）
 */
export const calculateBMI = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) {
    return 0;
  }
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  return Math.round(bmi * 10) / 10; // 保留1位小数
};

/**
 * 根据BMI值获取健康状态描述
 * @param bmi BMI值
 * @returns 状态对象包含status（状态描述）和color（颜色类）
 */
export const getBMIStatus = (bmi: number): { status: string; color: string } => {
  if (bmi < 18.5) {
    return { status: '偏瘦', color: 'bg-yellow-100 text-yellow-700' };
  } else if (bmi >= 18.5 && bmi < 25) {
    return { status: '正常', color: 'bg-green-100 text-green-700' };
  } else if (bmi >= 25 && bmi < 30) {
    return { status: '超重', color: 'bg-orange-100 text-orange-700' };
  } else {
    return { status: '肥胖', color: 'bg-red-100 text-red-700' };
  }
};

/**
 * 计算热量数据对象（包含目标、已摄入、剩余）
 * @param profile 用户档案
 * @param mealPlan 饮食计划
 * @param activityLevel 活动系数（可选，默认1.375）
 * @returns 包含target、consumed、remaining的对象
 */
export const calculateCalorieData = (
  profile: UserProfile | null, 
  mealPlan: MealPlan | null,
  activityLevel: number = 1.375
): { target: number; consumed: number; remaining: number } => {
  // 如果没有用户档案，返回默认值
  if (!profile) {
    return { target: 1500, consumed: 0, remaining: 1500 };
  }
  
  const target = calculateDailyCalorieTarget(profile, activityLevel);
  const consumed = calculateConsumedCalories(mealPlan);
  const remaining = calculateRemainingCalories(target, consumed);
  
  return { target, consumed, remaining };
};

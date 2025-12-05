
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, MealPlan, Recipe } from "@sugarsmart/shared";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Mock Mode - Set to true to use sample data instead of real API
const MOCK_MODE = true;

// Mock Data
const mockMealPlan: MealPlan = [
  {
    id: 'mock-breakfast-1',
    name: '燕麦配浆果和杏仁',
    mealType: 'Breakfast',
    time: '08:00',
    description: '丰盛且富含纤维的早餐，有助于全天稳定血糖水平。',
    ingredients: [
      { name: '钢切燕麦', amount: '1/2 杯' },
      { name: '混合浆果（蓝莓、草莓）', amount: '1/2 杯' },
      { name: '切片杏仁', amount: '2 汤匙' },
      { name: '肉桂粉', amount: '1/2 茶匙' },
      { name: '无糖杏仁奶', amount: '1 杯' }
    ],
    steps: [
      '在小锅中将杏仁奶煮至微沸。',
      '加入钢切燕麦，转小火。',
      '炖煮 20-25 分钟，偶尔搅拌，直到燕麦变软。',
      '转移到碗中，撒上新鲜浆果和切片杏仁。',
      '撒上肉桂粉，趁热享用。'
    ],
    nutrition: {
      calories: 320,
      carbs: 42,
      protein: 12,
      fat: 11,
      giLevel: 'Low'
    },
    tips: '钢切燕麦比速溶燕麦的血糖生成指数更低。纤维和健康脂肪有助于减缓糖分吸收。'
  },
  {
    id: 'mock-lunch-1',
    name: '烤鸡肉藜麦沙拉',
    mealType: 'Lunch',
    time: '12:30',
    description: '富含蛋白质和营养的午餐，搭配复合碳水化合物和丰富蔬菜。',
    ingredients: [
      { name: '烤鸡胸肉', amount: '150克' },
      { name: '煮熟的藜麦', amount: '1/2 杯' },
      { name: '混合沙拉蔬菜', amount: '2 杯' },
      { name: '圣女果', amount: '1/2 杯' },
      { name: '黄瓜', amount: '1/2 杯，切片' },
      { name: '牛油果', amount: '1/4 个' },
      { name: '橄榄油', amount: '1 汤匙' },
      { name: '柠檬汁', amount: '1 汤匙' }
    ],
    steps: [
      '用香草调味鸡胸肉，烤至完全熟透（内部温度 75°C）。',
      '让鸡肉静置 5 分钟，然后切成条状。',
      '在大碗中混合沙拉蔬菜、藜麦、番茄和黄瓜。',
      '放上切片鸡肉和牛油果。',
      '淋上橄榄油和柠檬汁。',
      '轻轻拌匀，立即享用。'
    ],
    nutrition: {
      calories: 450,
      carbs: 35,
      protein: 38,
      fat: 18,
      giLevel: 'Low'
    },
    tips: '藜麦是完整蛋白质，血糖生成指数低。搭配瘦肉蛋白和健康脂肪，可实现最佳血糖控制。'
  },
  {
    id: 'mock-dinner-1',
    name: '烤三文鱼配蔬菜',
    mealType: 'Dinner',
    time: '19:00',
    description: '富含 omega-3 的晚餐，搭配三文鱼和色彩丰富的非淀粉类蔬菜，有益心脏和代谢健康。',
    ingredients: [
      { name: '三文鱼片', amount: '180克' },
      { name: '西兰花小朵', amount: '1 杯' },
      { name: '彩椒', amount: '1 杯，切块' },
      { name: '西葫芦', amount: '1 个中等大小，切片' },
      { name: '橄榄油', amount: '2 汤匙' },
      { name: '大蒜', amount: '2 瓣，切碎' },
      { name: '柠檬', amount: '1/2 个' },
      { name: '新鲜莳萝', amount: '1 汤匙' }
    ],
    steps: [
      '烤箱预热至 200°C。',
      '将三文鱼放在铺有烘焙纸的烤盘上。',
      '在三文鱼周围摆放蔬菜，淋上橄榄油。',
      '用大蒜、莳萝、盐和胡椒调味三文鱼。',
      '在三文鱼和蔬菜上挤柠檬汁。',
      '烘烤 15-18 分钟，直到三文鱼熟透、蔬菜变软。',
      '趁热食用，配上额外的柠檬角。'
    ],
    nutrition: {
      calories: 420,
      carbs: 18,
      protein: 42,
      fat: 22,
      giLevel: 'Low'
    },
    tips: '三文鱼富含 omega-3 脂肪酸，有助于减少炎症并提高胰岛素敏感性。非淀粉类蔬菜在糖尿病饮食中可不限量食用。'
  }
];

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    mealType: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
    description: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING }
        }
      }
    },
    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        giLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
      }
    },
    tips: { type: Type.STRING }
  },
  required: ['id', 'name', 'mealType', 'ingredients', 'steps', 'nutrition', 'tips']
};

// We still ask for structure to ensure we get 3 distinct meals, then flatten it
const mealPlanResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    breakfast: { type: Type.ARRAY, items: recipeSchema },
    lunch: { type: Type.ARRAY, items: recipeSchema },
    dinner: { type: Type.ARRAY, items: recipeSchema }
  },
  required: ['breakfast', 'lunch', 'dinner']
};

export const generateMealPlan = async (profile: UserProfile): Promise<MealPlan> => {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockMealPlan;
  }

  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const prompt = `
    Generate a 1-day diabetic-friendly meal plan for a user with the following profile:
    - Age: ${profile.age}, Gender: ${profile.gender}
    - Height: ${profile.height}cm, Weight: ${profile.weight}kg
    - Condition: ${profile.diabetesType}
    - Fasting Glucose: ${profile.fastingGlucose}
    - Medications: ${profile.medication || 'None'}
    - Preferences: Likes ${profile.stapleFood.join(', ')}. 
    - Allergies/Avoid: ${profile.allergies.join(', ') || 'None'}
    - Meals per day: ${profile.mealsPerDay}
    - Special Request: ${profile.specialRequests || 'None'}

    Strictly follow these nutritional guidelines:
    1. Low Glycemic Index (GI) ingredients.
    2. Balanced macronutrients suitable for diabetes management.
    3. Clear, easy-to-follow steps.
    
    Provide at least 1 option for Breakfast, 1 for Lunch, and 1 for Dinner.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: mealPlanResponseSchema,
        systemInstruction: "You are a clinical nutritionist specializing in diabetes care. Create safe, delicious, and culturally appropriate meal plans.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    
    // Flatten and assign default times
    const breakfast = (data.breakfast || []).map((r: any) => ({ ...r, mealType: 'Breakfast', time: '08:00', id: Date.now() + Math.random().toString() }));
    const lunch = (data.lunch || []).map((r: any) => ({ ...r, mealType: 'Lunch', time: '12:30', id: Date.now() + Math.random().toString() }));
    const dinner = (data.dinner || []).map((r: any) => ({ ...r, mealType: 'Dinner', time: '19:00', id: Date.now() + Math.random().toString() }));

    return [...breakfast, ...lunch, ...dinner] as MealPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateSingleRecipe = async (profile: UserProfile, mealType: string): Promise<Recipe> => {
  // Return mock data if in mock mode
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return a random recipe from mock data based on meal type
    const mockRecipe = mockMealPlan.find(r => r.mealType.toLowerCase() === mealType.toLowerCase()) || mockMealPlan[0];
    return { ...mockRecipe, id: Date.now().toString() };
  }

  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    Generate a single ${mealType} recipe for a diabetic user:
    - Profile: ${profile.age}yo, ${profile.diabetesType}
    - Allergies: ${profile.allergies.join(', ') || 'None'}
    - Preferences: ${profile.stapleFood.join(', ')}
    
    Ensure low GI and high nutrition value.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    const recipe = JSON.parse(text) as Recipe;
    
    // Assign a default time based on type if missing (though the caller usually handles time now)
    let time = '10:00';
    if (mealType.toLowerCase().includes('breakfast')) time = '08:00';
    if (mealType.toLowerCase().includes('lunch')) time = '12:30';
    if (mealType.toLowerCase().includes('dinner')) time = '19:00';
    
    return { ...recipe, time };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

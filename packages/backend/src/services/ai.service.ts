import OpenAI from 'openai';
import { generateRecipeImages } from './image.service';

// 豆包AI配置
const ARK_API_KEY = process.env.ARK_API_KEY || '';
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
const ARK_MODEL = process.env.ARK_MODEL || 'doubao-seed-1-6-250615';

// 创建OpenAI客户端（兼容豆包API）
const openai = new OpenAI({
  apiKey: ARK_API_KEY,
  baseURL: ARK_BASE_URL,
});

// 用户档案类型（与前端shared类型一致）
export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: string;
  diabetesType: string;
  fastingGlucose: string;
  medication: string;
  stapleFood: string[];
  allergies: string[];
  mealsPerDay: number;
  specialRequests: string;
}

// 食谱类型
export interface Recipe {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  time: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    giLevel: 'Low' | 'Medium' | 'High';
  };
  tips: string;
}

// 构建Prompt
function buildMealPlanPrompt(profile: UserProfile): string {
  return `你是一位专业的糖尿病营养师。请为以下糖尿病患者生成一日三餐的个性化饮食计划。

用户信息：
- 年龄：${profile.age}岁
- 性别：${profile.gender === 'Male' ? '男' : '女'}
- 身高：${profile.height}cm
- 体重：${profile.weight}kg
- 糖尿病类型：${profile.diabetesType}
- 空腹血糖：${profile.fastingGlucose} mmol/L
- 当前用药：${profile.medication || '无'}
- 过敏食物：${profile.allergies.length > 0 ? profile.allergies.join('、') : '无'}
- 主食偏好：${profile.stapleFood.join('、')}
- 每日餐数：${profile.mealsPerDay}
- 特殊要求：${profile.specialRequests || '无'}

要求：
1. 生成早餐（08:00）、午餐（12:30）、晚餐（19:00）三个食谱
2. 所有食谱必须低GI（升糖指数低），适合糖尿病患者
3. 营养均衡，总热量控制合理
4. 考虑用户的过敏和偏好
5. 每餐热量：早餐300-400千卡，午餐400-500千卡，晚餐350-450千卡

请严格按照以下JSON格式返回，不要添加任何额外的文字说明：
[
  {
    "id": "breakfast-1",
    "name": "食谱名称",
    "mealType": "Breakfast",
    "time": "08:00",
    "description": "简短描述（1-2句话）",
    "ingredients": [
      {"name": "食材名称", "amount": "份量"}
    ],
    "steps": ["步骤1", "步骤2", "步骤3"],
    "nutrition": {
      "calories": 350,
      "carbs": 45,
      "protein": 15,
      "fat": 10,
      "giLevel": "Low"
    },
    "tips": "糖尿病饮食小贴士"
  },
  {
    "id": "lunch-1",
    "name": "食谱名称",
    "mealType": "Lunch",
    "time": "12:30",
    "description": "简短描述",
    "ingredients": [...],
    "steps": [...],
    "nutrition": {...},
    "tips": "..."
  },
  {
    "id": "dinner-1",
    "name": "食谱名称",
    "mealType": "Dinner",
    "time": "19:00",
    "description": "简短描述",
    "ingredients": [...],
    "steps": [...],
    "nutrition": {...},
    "tips": "..."
  }
]`;
}

// 生成饮食计划
export async function generateMealPlan(profile: UserProfile): Promise<Recipe[]> {
  try {
    const prompt = buildMealPlanPrompt(profile);
    
    const response = await openai.chat.completions.create({
      model: ARK_MODEL,
      messages: [
        {
          role: 'system',
          content: '你是一位专业的糖尿病营养师，擅长为糖尿病患者制定个性化的低GI饮食计划。你的回复必须是严格的JSON格式，不包含任何额外文字。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI返回内容为空');
    }

    // 解析JSON响应
    const recipes = JSON.parse(content) as Recipe[];
    
    // 验证返回的数据
    if (!Array.isArray(recipes) || recipes.length !== 3) {
      throw new Error('AI返回的食谱数量不正确');
    }

    // 为每个食谱生成唯一ID（避免React重复key警告）
    const timestamp = Date.now();
    const uniqueRecipes = recipes.map((recipe, index) => ({
      ...recipe,
      id: `${recipe.mealType.toLowerCase()}-${timestamp}-${index}`
    }));

    // 为每个食谱生成图片
    console.log('开始为食谱生成图片...');
    const recipeNames = uniqueRecipes.map(r => r.name);
    const imageUrls = await generateRecipeImages(recipeNames);
    
    // 将图片URL添加到食谱中
    const recipesWithImages = uniqueRecipes.map((recipe, index) => ({
      ...recipe,
      imageUrl: imageUrls[index]
    }));

    console.log('✓ 饮食计划生成完成（包含图片）');
    return recipesWithImages;
  } catch (error) {
    console.error('AI生成饮食计划失败:', error);
    throw new Error('生成饮食计划失败，请稍后重试');
  }
}

// 生成单个食谱（用于手动添加）
export async function generateSingleRecipe(
  profile: UserProfile,
  mealType: string
): Promise<Recipe> {
  try {
    const timeMap: Record<string, string> = {
      Breakfast: '08:00',
      Lunch: '12:30',
      Dinner: '19:00',
      Snack: '15:00'
    };

    const prompt = `你是一位专业的糖尿病营养师。请为以下糖尿病患者生成一个${mealType}食谱。

用户信息：
- 糖尿病类型：${profile.diabetesType}
- 过敏食物：${profile.allergies.join('、') || '无'}
- 主食偏好：${profile.stapleFood.join('、')}

要求：
1. 低GI食谱，适合糖尿病患者
2. 营养均衡
3. 考虑用户过敏和偏好

请严格按照以下JSON格式返回：
{
  "id": "${mealType.toLowerCase()}-${Date.now()}",
  "name": "食谱名称",
  "mealType": "${mealType}",
  "time": "${timeMap[mealType] || '12:00'}",
  "description": "简短描述",
  "ingredients": [{"name": "食材", "amount": "份量"}],
  "steps": ["步骤1", "步骤2"],
  "nutrition": {
    "calories": 300,
    "carbs": 40,
    "protein": 15,
    "fat": 10,
    "giLevel": "Low"
  },
  "tips": "糖尿病饮食小贴士"
}`;

    const response = await openai.chat.completions.create({
      model: ARK_MODEL,
      messages: [
        { role: 'system', content: '你是专业的糖尿病营养师，回复必须是JSON格式。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI返回内容为空');
    }

    const recipe = JSON.parse(content) as Recipe;
    return recipe;
  } catch (error) {
    console.error('AI生成单个食谱失败:', error);
    throw new Error('生成食谱失败，请稍后重试');
  }
}

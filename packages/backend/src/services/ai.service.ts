/**
 * AI饮食计划生成服务 - 豆包ARK版本
 * 
 * 使用豆包ARK API生成文本 + 豆包图片API生成图片
 * 全部使用国内可访问的API，稳定可靠
 */

import { generateRecipeImage } from './image.service';

// ==================== 环境变量 ====================
const ARK_API_KEY = process.env.ARK_API_KEY || '';
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
const ARK_MODEL = process.env.ARK_MODEL || 'doubao-seed-1-6-250615';

// ==================== 类型定义 ====================
interface UserProfile {
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

interface Recipe {
  id: string;
  name: string;
  mealType: string;
  time: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    giLevel: 'Low' | 'Medium' | 'High';
  };
  tips: string;
  imageUrl?: string;
}

// ==================== 核心功能 ====================

/**
 * 生成饮食计划 - 极简版本
 */
export async function generateMealPlan(profile: UserProfile): Promise<Recipe[]> {
  console.log('\n=== 开始生成饮食计划 ===');
  console.log('用户档案:', JSON.stringify(profile, null, 2));

  // 步骤1: 调用豆包ARK生成食谱文本
  console.log('\n[步骤1] 调用豆包ARK生成食谱文本...');
  const recipes = await generateRecipesWithARK(profile);
  console.log(`✓ 豆包生成成功，共${recipes.length}个食谱`);

  // 步骤2: 为每个食谱生成图片
  console.log('\n[步骤2] 为食谱生成AI图片...');
  const recipesWithImages = await addImagesToRecipes(recipes);
  console.log('✓ 图片生成完成');

  console.log('\n=== 饮食计划生成完成 ===\n');
  return recipesWithImages;
}

/**
 * 使用豆包ARK生成食谱文本
 */
async function generateRecipesWithARK(profile: UserProfile): Promise<Recipe[]> {
  if (!ARK_API_KEY) {
    throw new Error('ARK_API_KEY未配置');
  }

  const prompt = `
你是一个专业的糖尿病营养师。请为以下患者生成一天的饮食计划（早、中、晚三餐）。

**用户信息**：
- 年龄: ${profile.age}岁
- 性别: ${profile.gender}
- 身高: ${profile.height}cm
- 体重: ${profile.weight}kg  
- 糖尿病类型: ${profile.diabetesType}
- 空腹血糖: ${profile.fastingGlucose} mmol/L
- 用药: ${profile.medication || '无'}
- 主食偏好: ${profile.stapleFood.join('、')}
- 过敏食物: ${profile.allergies.length > 0 ? profile.allergies.join('、') : '无'}
- 特殊要求: ${profile.specialRequests || '无'}

**要求**：
1. 所有食材必须是低GI（血糖生成指数低）
2. 营养均衡，适合糖尿病患者
3. 步骤清晰，易于操作
4. 提供实用的饮食建议

**返回格式（严格JSON）**：
{
  "breakfast": {
    "name": "食谱名称",
    "mealType": "Breakfast",
    "description": "简短描述",
    "ingredients": [{"name": "食材名", "amount": "用量"}],
    "steps": ["步骤1", "步骤2"],
    "nutrition": {"calories": 350, "carbs": 45, "protein": 18, "fat": 12, "giLevel": "Low"},
    "tips": "饮食建议"
  },
  "lunch": {...同上格式...},
  "dinner": {...同上格式...}
}

请直接返回JSON，不要任何其他文字。
`.trim();

  try {
    const response = await fetch(`${ARK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARK_API_KEY}`
      },
      body: JSON.stringify({
        model: ARK_MODEL,
        messages: [
          {
            role: 'system',
            content: '你是专业的糖尿病营养师，擅长制定低GI饮食计划。你只返回纯JSON格式，不添加任何markdown标记或其他文字。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`豆包ARK API请求失败: ${response.status} ${errorText}`);
    }

    const data = await response.json() as any;
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('豆包ARK返回数据格式错误');
    }

    let content = data.choices[0].message.content;
    
    // 清理可能的markdown标记
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(content);
    
    // 转换为Recipe数组
    const recipes: Recipe[] = [
      {
        ...parsed.breakfast,
        id: `breakfast-${Date.now()}`,
        mealType: 'Breakfast',
        time: '08:00'
      },
      {
        ...parsed.lunch,
        id: `lunch-${Date.now()}`,
        mealType: 'Lunch',
        time: '12:30'
      },
      {
        ...parsed.dinner,
        id: `dinner-${Date.now()}`,
        mealType: 'Dinner',
        time: '19:00'
      }
    ];

    return recipes;
  } catch (error) {
    console.error('❌ 豆包ARK生成失败:', error);
    throw new Error(`豆包ARK生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 为食谱添加AI生成的图片
 */
async function addImagesToRecipes(recipes: Recipe[]): Promise<Recipe[]> {
  const results: Recipe[] = [];

  for (const recipe of recipes) {
    console.log(`  - 为"${recipe.name}"生成图片...`);
    
    try {
      const imageUrl = await generateRecipeImage(recipe.name);
      results.push({ ...recipe, imageUrl });
      console.log(`    ✓ 成功: ${imageUrl.substring(0, 60)}...`);
    } catch (error) {
      console.error(`    ✗ 失败:`, error);
      // 即使图片生成失败，也返回食谱（不含图片）
      results.push(recipe);
    }
  }

  return results;
}

/**
 * 生成单个食谱（备用）
 */
export async function generateSingleRecipe(profile: UserProfile, mealType: string): Promise<Recipe> {
  console.log(`\n=== 生成单个食谱: ${mealType} ===`);
  
  // 简化：直接生成完整计划，然后返回对应的一个
  const fullPlan = await generateMealPlan(profile);
  const recipe = fullPlan.find(r => r.mealType.toLowerCase() === mealType.toLowerCase());
  
  if (!recipe) {
    throw new Error(`未找到${mealType}类型的食谱`);
  }
  
  return recipe;
}

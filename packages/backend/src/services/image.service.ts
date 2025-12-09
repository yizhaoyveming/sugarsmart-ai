// 豆包文生图服务
const DOUBAO_IMAGE_API_KEY = process.env.DOUBAO_IMAGE_API_KEY || '';
const DOUBAO_IMAGE_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const DOUBAO_IMAGE_MODEL = 'doubao-seedream-4-0-250828';

/**
 * 为食谱名称生成专业美食摄影图片
 * @param recipeName 食谱名称
 * @returns 图片URL
 */
export async function generateRecipeImage(recipeName: string): Promise<string> {
  if (!DOUBAO_IMAGE_API_KEY) {
    throw new Error('DOUBAO_IMAGE_API_KEY 未配置');
  }

  // 构建专业的美食摄影prompt - 明确指定是食物菜肴
  const prompt = `美食菜肴摄影作品：${recipeName}这道菜，真实的食物照片，精美摆盘在白色瓷盘上，自然光线，高清细节，食物特写镜头，餐桌场景，专业美食摄影，诱人可口，4K高清，restaurant food photography`;

  try {
    const response = await fetch(DOUBAO_IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_IMAGE_API_KEY}`
      },
      body: JSON.stringify({
        model: DOUBAO_IMAGE_MODEL,
        prompt,
        size: '2K',
        response_format: 'url',
        watermark: false, // 关闭水印
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`豆包图片API请求失败: ${response.status} ${errorText}`);
    }

    const data = await response.json() as any;
    
    // 验证返回数据
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('豆包API返回数据格式错误');
    }

    const imageUrl = data.data[0].url as string;
    if (!imageUrl) {
      throw new Error('未获取到图片URL');
    }

    console.log(`✓ 成功生成食谱图片: ${recipeName}`);
    return imageUrl;
  } catch (error) {
    console.error(`✗ 生成食谱图片失败 [${recipeName}]:`, error);
    throw new Error(`生成食谱图片失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 批量生成食谱图片（并发执行）
 * @param recipeNames 食谱名称数组
 * @returns 图片URL数组
 */
export async function generateRecipeImages(recipeNames: string[]): Promise<string[]> {
  console.log(`开始批量生成 ${recipeNames.length} 张食谱图片...`);
  
  // 并发生成所有图片
  const imagePromises = recipeNames.map(name => generateRecipeImage(name));
  
  try {
    const images = await Promise.all(imagePromises);
    console.log(`✓ 成功生成 ${images.length} 张食谱图片`);
    return images;
  } catch (error) {
    console.error('批量生成食谱图片失败:', error);
    throw error; // 任何一个失败都抛出错误
  }
}

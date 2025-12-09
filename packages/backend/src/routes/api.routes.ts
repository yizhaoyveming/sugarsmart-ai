import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';
import { generateMealPlan, generateSingleRecipe } from '../services/ai.service';

const router = Router();

// ==================== 用户认证 ====================

// 用户注册
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, password, nickname } = req.body;

    // 验证必填字段（nickname可选，默认使用username）
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '缺少必填字段' }
      });
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USERNAME_EXISTS', message: '用户名已存在' }
      });
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户（nickname默认使用username）
    const user = await prisma.user.create({
      data: { 
        username, 
        passwordHash, 
        nickname: nickname || username 
      }
    });

    // 生成token
    const token = generateToken({ userId: user.id, username: user.username });

    res.json({
      success: true,
      data: {
        user: { id: user.id, username: user.username, nickname: user.nickname },
        token
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// 用户登录
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_FAILED', message: '用户名或密码错误' }
      });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_FAILED', message: '用户名或密码错误' }
      });
    }

    // 生成token
    const token = generateToken({ userId: user.id, username: user.username });

    res.json({
      success: true,
      data: {
        user: { id: user.id, username: user.username, nickname: user.nickname },
        token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 用户档案 ====================

// 获取用户档案
router.get('/users/:userId/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '用户档案不存在' }
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('获取档案失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// 更新用户档案
router.put('/users/:userId/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: { userId, ...profileData }
    });

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('更新档案失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== AI饮食计划 ====================

// 生成饮食计划
router.post('/meal-plan/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const profile = req.body;

    // 调用AI生成饮食计划
    const recipes = await generateMealPlan(profile);

    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error('生成饮食计划失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'GENERATION_FAILED', message: error instanceof Error ? error.message : '生成失败' }
    });
  }
});

// 保存饮食计划
router.post('/meal-plan', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, date, mealPlan } = req.body;

    const plan = await prisma.mealPlan.upsert({
      where: { userId_planDate: { userId, planDate: new Date(date) } },
      update: { recipes: mealPlan },
      create: { userId, planDate: new Date(date), recipes: mealPlan }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('保存饮食计划失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// 获取饮食计划
router.get('/meal-plan/:date', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const { userId } = req.query;

    const plan = await prisma.mealPlan.findUnique({
      where: { userId_planDate: { userId: userId as string, planDate: new Date(date) } }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: '未找到该日期的饮食计划' }
      });
    }

    res.json({ success: true, data: plan.recipes });
  } catch (error) {
    console.error('获取饮食计划失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 血糖记录 ====================

// 添加血糖记录
router.post('/users/:userId/glucose', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { date, time, type, value, note } = req.body;

    const record = await prisma.glucoseRecord.create({
      data: {
        userId,
        recordDate: new Date(date),
        recordTime: time,
        type,
        value,
        note
      }
    });

    res.json({ success: true, data: record });
  } catch (error) {
    console.error('添加血糖记录失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// 获取血糖历史
router.get('/users/:userId/glucose', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = { userId };
    if (startDate || endDate) {
      where.recordDate = {};
      if (startDate) where.recordDate.gte = new Date(startDate as string);
      if (endDate) where.recordDate.lte = new Date(endDate as string);
    }

    const records = await prisma.glucoseRecord.findMany({
      where,
      orderBy: { recordDate: 'desc' }
    });

    res.json({ success: true, data: records });
  } catch (error) {
    console.error('获取血糖记录失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// 删除血糖记录
router.delete('/users/:userId/glucose/:recordId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { recordId } = req.params;

    await prisma.glucoseRecord.delete({
      where: { id: recordId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('删除血糖记录失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// ==================== 收藏功能 ====================

// 添加收藏
router.post('/users/:userId/favorites', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { recipeId, recipeName, recipeData } = req.body;

    await prisma.favorite.create({
      data: { userId, recipeId, recipeName, recipeData }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('添加收藏失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// 取消收藏
router.delete('/users/:userId/favorites/:recipeId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, recipeId } = req.params;

    await prisma.favorite.deleteMany({
      where: { userId, recipeId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('取消收藏失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

// 获取收藏列表
router.get('/users/:userId/favorites', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const recipeIds = favorites.map(f => f.recipeId);
    res.json({ success: true, data: recipeIds });
  } catch (error) {
    console.error('获取收藏失败:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器错误' }
    });
  }
});

export default router;

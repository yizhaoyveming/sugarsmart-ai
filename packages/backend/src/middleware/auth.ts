import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

// 扩展Express Request类型，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// JWT认证中间件
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_MISSING',
          message: '未提供认证Token'
        }
      });
    }

    // 移除 "Bearer " 前缀
    const token = authHeader.replace('Bearer ', '');
    
    // 验证token
    const decoded = verifyToken(token);
    
    // 将用户信息附加到请求对象
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_INVALID',
        message: 'Token无效或已过期'
      }
    });
  }
}

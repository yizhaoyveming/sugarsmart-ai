import { PrismaClient } from '@prisma/client';

// 创建 Prisma Client 单例
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// 测试数据库连接
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
}

// 优雅关闭数据库连接
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('🔌 数据库连接已断开');
}

export default prisma;

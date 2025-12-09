import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';

const PORT = process.env.PORT || 8080;

// 启动服务器
async function startServer() {
  try {
    // 连接数据库
    await connectDatabase();
    
    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🍬 SugarSmart AI Backend Server                      ║
║                                                           ║
║     ✅ 服务器运行中                                        ║
║     📡 端口: ${PORT}                                        ║
║     🌍 环境: ${process.env.NODE_ENV || 'development'}      ║
║     📊 数据库: PostgreSQL                                  ║
║     🤖 AI: 豆包 (Doubao)                                   ║
║                                                           ║
║     API文档: http://localhost:${PORT}/api                 ║
║     健康检查: http://localhost:${PORT}/health             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 正在关闭服务器...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 正在关闭服务器...');
  await disconnectDatabase();
  process.exit(0);
});

// 启动
startServer();

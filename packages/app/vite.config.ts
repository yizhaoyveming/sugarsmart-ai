import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3001,
    host: '0.0.0.0',
    allowedHosts: [
      'xbpnaciwyekd.sealoshzh.site',  // 3001端口的公网域名
    ],
  },
  plugins: [react()],
  
  // 🔧 修复 EXDEV 错误：使用系统临时目录存储 Vite 缓存
  cacheDir: '/tmp/.vite-app',
  
  // 依赖优化配置
  optimizeDeps: {
    force: true,  // 强制重新优化依赖
  },
});

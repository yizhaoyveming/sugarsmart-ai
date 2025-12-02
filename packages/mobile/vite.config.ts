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
});

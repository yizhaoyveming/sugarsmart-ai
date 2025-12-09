module.exports = {
  apps: [
    {
      name: 'sugarsmart-backend',
      script: 'npm',
      args: 'run dev:backend',
      cwd: '/home/devbox/project',
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      },
      error_file: '/home/devbox/project/logs/backend-error.log',
      out_file: '/home/devbox/project/logs/backend-out.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000
    },
    {
      name: 'sugarsmart-web',
      script: 'npm',
      args: 'run dev:web',
      cwd: '/home/devbox/project',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: '/home/devbox/project/logs/web-error.log',
      out_file: '/home/devbox/project/logs/web-out.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000
    },
    {
      name: 'sugarsmart-app',
      script: 'npm',
      args: 'run dev:app',
      cwd: '/home/devbox/project',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      error_file: '/home/devbox/project/logs/app-error.log',
      out_file: '/home/devbox/project/logs/app-out.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000
    }
  ]
};

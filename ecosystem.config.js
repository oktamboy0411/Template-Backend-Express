module.exports = {
   apps: [
      {
         name: 'template-backend',
         script: 'dist/server.js',
         instances: 'max', // Use all available CPU cores
         exec_mode: 'cluster', // Enable cluster mode for multiple instances
         watch: false,
         env: {
            NODE_ENV: 'development',
         },
         env_production: {
            NODE_ENV: 'production',
         },
         error_file: './logs/pm2-error.log',
         out_file: './logs/pm2-out.log',
         log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
         merge_logs: true,
         autorestart: true,
         max_memory_restart: '1G',
      },
   ],
}

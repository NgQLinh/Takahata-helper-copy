module.exports = {
  apps: [
    {
      name: "next-app",
      script: "server.js",
      cwd: "C:\\apps\\next-app",

      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
        PORT: 80,

        // Khai báo biến môi trường runtime tại đây nếu cần.
        // Không đưa secret vào biến NEXT_PUBLIC_*.
        // DATABASE_URL: "...",
        // JWT_SECRET: "...",
        // API_SECRET: "...",
      },

      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      restart_delay: 3000,
      time: true,

      out_file: "C:\\apps\\next-app\\logs\\server.log",
      error_file: "C:\\apps\\next-app\\logs\\error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
/** PM2 process config for VPS deployment (Caddy usually proxies to port 4000). */
module.exports = {
  apps: [
    {
      name: "imotrak-api",
      script: "dist/index.js",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};

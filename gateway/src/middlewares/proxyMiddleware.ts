import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const proxyMiddleware = (targetUrl: string) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(/^\/[^/]+/, ''), // Optional: remove the base path from the target
  });
};

export default proxyMiddleware;

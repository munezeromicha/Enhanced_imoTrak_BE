import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const proxyMiddleware = (targetUrl: string) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\/[^/]+/, ''),

    onProxyReq: (proxyReq, req) => {
      const user = (req as any).user;

      if (user) {
        proxyReq.setHeader('x-user-id', user.userId);
        proxyReq.setHeader('x-org-id', user.orgId);
        proxyReq.setHeader('x-role', user.role);
      }
    }
  });
};

export default proxyMiddleware;

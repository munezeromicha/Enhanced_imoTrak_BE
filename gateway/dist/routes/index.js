"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proxyMiddleware_1 = __importDefault(require("../middlewares/proxyMiddleware"));
const router = (0, express_1.Router)();
// Health check route
router.get('/health', (req, res) => {
    return ({ status: 'The gateway is live fam' });
});
// Proxy setup for the organization service
router.use('/organization', (0, proxyMiddleware_1.default)(process.env.ORGANIZATION_SERVICE_URL || ''));
// Proxy setup for the auth service
router.use('/auth', (0, proxyMiddleware_1.default)(process.env.AUTH_SERVICE_URL || ''));
// Then here we will add more routes for other services. Kko dufitemo nyinshi cne..
exports.default = router;

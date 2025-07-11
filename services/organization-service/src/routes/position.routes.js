"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const position_controllers_1 = require("../controllers/position.controllers");
const validationMiddlewares_1 = require("../middlewares/validationMiddlewares");
const positionRoutes = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: Position management APIs
 */
/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Create a new position under a unit
 *     tags: [Positions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position_name:
 *                 type: string
 *                 example: Software Engineer
 *               position_description:
 *                 type: string
 *                 example: Responsible for building and maintaining applications
 *               position_access:
 *                 type: object
 *                 example: { canEdit: true, canDelete: false }
 *               unit_id:
 *                 type: string
 *                 format: uuid
 *                 example: 67f7d0a1-c455-4c5b-9251-b40100d19e55
 *     responses:
 *       201:
 *         description: Position created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create position
 */
positionRoutes.post('/', validationMiddlewares_1.validateCreatePosition, position_controllers_1.handleCreatePosition);
exports.default = positionRoutes;

import { Request, Response } from 'express';
import * as Joi from 'joi';
import { loginService } from '../services/authService';

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials or inactive user
 */
export const login = async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, password } = req.body;
  try {
    const token = await loginService(email, password);
    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(401).json({ message: err.message || 'Invalid credentials' });
  }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
export const logout = async (_req: Request, res: Response) => {
  // For JWT, logout is handled client-side by deleting the token.
  return res.status(200).json({ message: 'Logged out successfully' });
}; 
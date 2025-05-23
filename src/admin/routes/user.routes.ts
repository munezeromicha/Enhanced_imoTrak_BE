// import express from 'express';
// import {
//   registerOrganization,
//   getOrganizations,
//   getOrganization,
//   editOrganization,
//   removeOrganization,
// } from '../controllers/organization.controller';
// import { authenticateAdmin } from '../../middleware/auth.middleware';

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Organizations
//  *   description: Admin-only organization management
//  */

// /**
//  * @swagger
//  * /organizations:
//  *   get:
//  *     summary: Get all organizations (Admin only)
//  *     tags: [Organizations]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of organizations
//  *       403:
//  *         description: Forbidden
//  */
// router.get('/organizations', authenticateAdmin, getOrganizations);

// /**
//  * @swagger
//  * /organizations/{id}:
//  *   get:
//  *     summary: Get an organization by ID (Admin only)
//  *     tags: [Organizations]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: Organization ID
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Organization found
//  *       404:
//  *         description: Organization not found
//  */
// router.get('/organizations/:id', authenticateAdmin, getOrganization);

// /**
//  * @swagger
//  * /organizations:
//  *   post:
//  *     summary: Register a new organization (Admin only)
//  *     tags: [Organizations]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - address
//  *               - phone
//  *               - email
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: University of Rwanda
//  *               address:
//  *                 type: string
//  *                 example: KN 7 Ave, Kigali
//  *               phone:
//  *                 type: string
//  *                 example: +250-790-323-567
//  *               email:
//  *                 type: string
//  *                 example: ur@ur.ac.rw
//  *     responses:
//  *       201:
//  *         description: Organization created successfully
//  *       403:
//  *         description: Forbidden
//  */
// router.post('/organizations', authenticateAdmin, registerOrganization);

// /**
//  * @swagger
//  * /organizations/{id}:
//  *   put:
//  *     summary: Update an organization by ID (Admin only)
//  *     tags: [Organizations]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Organization ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               address:
//  *                 type: string
//  *               phone:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 example: Active
//  *     responses:
//  *       200:
//  *         description: Organization updated successfully
//  *       404:
//  *         description: Organization not found
//  */
// router.put('/organizations/:id', authenticateAdmin, editOrganization);

// /**
//  * @swagger
//  * /organizations/{id}:
//  *   delete:
//  *     summary: Delete an organization by ID (Admin only)
//  *     tags: [Organizations]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: Organization ID
//  *         schema:
//  *           type: string
//  *     responses:
//  *       204:
//  *         description: Organization deleted successfully
//  *       404:
//  *         description: Organization not found
//  */
// router.delete('/organizations/:id', authenticateAdmin, removeOrganization);

// export default router;

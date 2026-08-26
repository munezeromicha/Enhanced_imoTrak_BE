import { Router } from 'express';
import * as controller from '../controllers/fuel.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { attachPositionAccess } from '../middlewares/attachPositionAccess';

const fuelRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Fuel
 *   description: >
 *     Fuel requisitions for vehicles and generators, carried through the four
 *     sections of the paper form (applicant, recommending authority,
 *     confirmation of funding, verification), plus the fuel account ledger
 *     behind the monthly consumption report.
 */

/**
 * @swagger
 * /v2/fuel/requisitions:
 *   get:
 *     summary: List fuel requisitions in scope
 *     description: >
 *       `fuel.view` returns every requisition the caller's campus scope allows.
 *       A position with only `fuel.viewOwn` sees the requisitions it raised.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SUBMITTED, RECOMMENDED, FUNDING_CONFIRMED, ISSUED, RECEIVED, REJECTED, CANCELLED]
 *       - in: query
 *         name: request_type
 *         schema:
 *           type: string
 *           enum: [VEHICLE, GENERATOR]
 *       - in: query
 *         name: mine
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Fuel requisitions retrieved successfully
 *       403:
 *         description: Access denied
 */
fuelRoutes.get('/requisitions', authenticateToken, attachPositionAccess, controller.listRequisitions);

/**
 * @swagger
 * /v2/fuel/requisitions:
 *   post:
 *     summary: Raise a fuel requisition (section I of the form)
 *     description: >
 *       A VEHICLE request requires `vehicle_id` and the logbook reading in
 *       kilometres, which must not be below the vehicle's last recorded
 *       reading. A GENERATOR request requires `generator_id` and the gauge
 *       reading as a percentage.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [request_type, quantity_requested_litres, purpose]
 *             properties:
 *               request_type:
 *                 type: string
 *                 enum: [VEHICLE, GENERATOR]
 *               vehicle_id:
 *                 type: string
 *               generator_id:
 *                 type: string
 *               quantity_requested_litres:
 *                 type: number
 *               odometer_km:
 *                 type: integer
 *               fuel_indicator_percent:
 *                 type: integer
 *               purpose:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fuel requisition submitted successfully
 *       400:
 *         description: Validation error, or a logbook reading below the last recorded one
 *       403:
 *         description: Access denied
 */
fuelRoutes.post('/requisitions', authenticateToken, attachPositionAccess, controller.createRequisition);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}:
 *   get:
 *     summary: One fuel requisition with every section filled in so far
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fuel requisition retrieved successfully
 *       404:
 *         description: Not found or outside your scope
 */
fuelRoutes.get('/requisitions/:id', authenticateToken, attachPositionAccess, controller.getRequisition);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}/chain:
 *   get:
 *     summary: Where the form is in the approval line and who signs next
 *     description: >
 *       One entry per section with who signed it and when, plus — for the
 *       section the form is currently sitting on — the people who hold the
 *       permission to sign it.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Approval chain retrieved successfully
 */
fuelRoutes.get('/requisitions/:id/chain', authenticateToken, attachPositionAccess, controller.requisitionChain);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}/recommend:
 *   post:
 *     summary: Section II — Assets and Services Management recommends the request
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fuel requisition recommended
 *       409:
 *         description: The form is not at this step
 */

fuelRoutes.post('/requisitions/:id/recommend', authenticateToken, attachPositionAccess, controller.recommendRequisition);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}/confirm-funding:
 *   post:
 *     summary: Section III — the Director of Finance confirms the funding
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Funding confirmed
 *       409:
 *         description: The form has not been recommended yet
 */
fuelRoutes.post('/requisitions/:id/confirm-funding', authenticateToken, attachPositionAccess, controller.confirmFunding);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}/issue:
 *   post:
 *     summary: Section IV — the logistics desk issues the fuel
 *     description: >
 *       Records what was supplied, posts the spend to the fuel account, and
 *       carries the reading forward onto the vehicle's odometer or the
 *       generator's gauge. All in one transaction.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity_supplied_litres, amount_rwf]
 *             properties:
 *               quantity_supplied_litres:
 *                 type: number
 *               amount_rwf:
 *                 type: number
 *               issued_on:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Fuel issued and posted to the fuel account
 *       409:
 *         description: Funding has not been confirmed yet
 */
fuelRoutes.post('/requisitions/:id/issue', authenticateToken, attachPositionAccess, controller.issueFuel);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}/receive:
 *   post:
 *     summary: Sign for the fuel received
 *     description: The applicant signs for their own fuel; a logistics officer may sign on their behalf.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fuel receipt signed
 *       403:
 *         description: Only the applicant can sign for this fuel
 */
fuelRoutes.post('/requisitions/:id/receive', authenticateToken, attachPositionAccess, controller.receiveFuel);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}/reject:
 *   post:
 *     summary: Refuse a requisition at any step before the fuel is issued
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fuel requisition rejected
 *       409:
 *         description: Fuel has already been issued
 */
fuelRoutes.post('/requisitions/:id/reject', authenticateToken, attachPositionAccess, controller.rejectRequisition);

/**
 * @swagger
 * /v2/fuel/requisitions/{id}/cancel:
 *   post:
 *     summary: Withdraw your own requisition before anyone has acted on it
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fuel requisition withdrawn
 *       409:
 *         description: Already acted on
 */
fuelRoutes.post('/requisitions/:id/cancel', authenticateToken, attachPositionAccess, controller.cancelRequisition);

/**
 * @swagger
 * /v2/fuel/vehicles:
 *   get:
 *     summary: Vehicles a requisition can be raised against, with their latest odometer
 *     description: >
 *       `latest_odometer` is the reading the next logbook entry starts from —
 *       the last returned odometer, falling back to the vehicle's registered
 *       reading. The request form shows it so the driver does not have to guess.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 */
fuelRoutes.get('/vehicles', authenticateToken, attachPositionAccess, controller.listVehicles);

/**
 * @swagger
 * /v2/fuel/vehicles/{vehicle_id}/availability:
 *   get:
 *     summary: Fuel issued for a vehicle and not yet sent out on a trip
 *     tags:
 *       - Fuel
 *     description: >
 *       Litres signed for on completed requisitions for this vehicle, less the
 *       litres already handed to trips through reservations. The reservation
 *       screen reads this when a vehicle is assigned so the trip starts with
 *       the figure the fuel desk recorded rather than one keyed in by hand.
 *       Readable by a position that may assign vehicles or read fuel records.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability for this vehicle
 *       403:
 *         description: Not allowed to read fuel records
 *       404:
 *         description: Vehicle not found
 */
fuelRoutes.get(
  '/vehicles/:vehicle_id/availability',
  authenticateToken,
  attachPositionAccess,
  controller.vehicleFuelAvailability
);

/**
 * @swagger
 * /v2/fuel/generators:
 *   get:
 *     summary: Generators in scope
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Generators retrieved successfully
 *   post:
 *     summary: Register a generator
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [generator_name]
 *             properties:
 *               generator_name:
 *                 type: string
 *               generator_code:
 *                 type: string
 *               location:
 *                 type: string
 *               unit_id:
 *                 type: string
 *               fuel_level_percent:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Generator registered successfully
 *       409:
 *         description: A generator with that name already exists
 */
fuelRoutes.get('/generators', authenticateToken, attachPositionAccess, controller.listGenerators);
fuelRoutes.post('/generators', authenticateToken, attachPositionAccess, controller.createGenerator);

/**
 * @swagger
 * /v2/fuel/generators/{id}:
 *   patch:
 *     summary: Update a generator
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Generator updated successfully
 */
fuelRoutes.patch('/generators/:id', authenticateToken, attachPositionAccess, controller.updateGenerator);

/**
 * @swagger
 * /v2/fuel/replenishments:
 *   post:
 *     summary: Add money to the fuel account
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount_rwf]
 *             properties:
 *               amount_rwf:
 *                 type: number
 *               description:
 *                 type: string
 *               occurred_on:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Fuel account replenished
 */
fuelRoutes.post('/replenishments', authenticateToken, attachPositionAccess, controller.replenish);

/**
 * @swagger
 * /v2/fuel/report:
 *   get:
 *     summary: Fuel consumption report with running balance
 *     description: >
 *       One row per ledger entry in date order. `opening_balance` is the
 *       account total before `from`, so a report for a single month still
 *       reconciles against the months before it.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Fuel consumption report generated
 */
fuelRoutes.get('/report', authenticateToken, attachPositionAccess, controller.consumptionReport);

/**
 * @swagger
 * /v2/fuel/balance:
 *   get:
 *     summary: Current fuel account balance in RWF
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fuel account balance retrieved
 */
fuelRoutes.get('/balance', authenticateToken, attachPositionAccess, controller.balance);

/**
 * @swagger
 * /v2/fuel/vehicles/{vehicleId}/history:
 *   get:
 *     summary: What this vehicle has been fuelled with
 *     description: >
 *       Built from completed requisitions, so a form still going round for
 *       signature does not appear. Consumption is worked out between
 *       consecutive odometer readings; the first fill has none because there
 *       is no earlier reading to measure against.
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fuel history retrieved successfully
 *       404:
 *         description: Vehicle not found
 */
fuelRoutes.get('/vehicles/:vehicleId/history', authenticateToken, attachPositionAccess, controller.vehicleFuelHistory);

/**
 * @swagger
 * /v2/fuel/generators/{generatorId}/history:
 *   get:
 *     summary: What this generator has been fuelled with
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: generatorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fuel history retrieved successfully
 */
fuelRoutes.get('/generators/:generatorId/history', authenticateToken, attachPositionAccess, controller.generatorFuelHistory);

export default fuelRoutes;

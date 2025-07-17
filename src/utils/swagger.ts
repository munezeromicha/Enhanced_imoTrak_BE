import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Imotrak API',
      version: '1.0.0',
      description: 'API documentation for Imotrak Backend',
    },
    servers: [
      { url: `http://localhost:${PORT}` },
      { url: 'https://imotrak-backside-lah2.onrender.com' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        PositionAccess: {
          type: 'object',
          properties: {
            organizations: {
              type: 'object',
              properties: {
                create: { type: 'boolean' },
                view: { type: 'boolean' },
                update: { type: 'boolean' },
                delete: { type: 'boolean' },
              },
            },
            units: {
              type: 'object',
              properties: {
                create: { type: 'boolean' },
                view: { type: 'boolean' },
                update: { type: 'boolean' },
                delete: { type: 'boolean' },
              },
            },
            positions: {
              type: 'object',
              properties: {
                create: { type: 'boolean' },
                view: { type: 'boolean' },
                update: { type: 'boolean' },
                delete: { type: 'boolean' },
              },
            },
            users: {
              type: 'object',
              properties: {
                create: { type: 'boolean' },
                view: { type: 'boolean' },
                update: { type: 'boolean' },
                delete: { type: 'boolean' },
              },
            },
            vehicleModels: {
              type: 'object',
              properties: {
                create: { type: 'boolean' },
                view: { type: 'boolean' },
                viewSingle: { type: 'boolean' },
                update: { type: 'boolean' },
                delete: { type: 'boolean' },
              },
            },
            vehicles: {
              type: 'object',
              properties: {
                create: { type: 'boolean' },
                view: { type: 'boolean' },
                viewSingle: { type: 'boolean' },
                update: { type: 'boolean' },
                delete: { type: 'boolean' },
              },
            },
            Reservation: {
              type: 'object',
              properties: {
                reservation_id: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                reservation_purpose: { type: 'string' },
                start_location: { type: 'string' },
                reservation_destination: { type: 'string' },
                departure_date: { type: 'string', format: 'date-time' },
                expected_returning_date: { type: 'string', format: 'date-time' },
                reservation_status: { type: 'string' },
                reviewed_at: { type: 'string', format: 'date-time', nullable: true },
                rejection_comment: { type: 'string', nullable: true },
                user_id: { type: 'string' },
                reserved_vehicles: { type: 'array', items: { type: 'object' } },
              },
            },
            CreateReservation: {
              type: 'object',
              properties: {
                reservation_purpose: { type: 'string' },
                start_location: { type: 'string' },
                reservation_destination: { type: 'string' },
                departure_date: { type: 'string', format: 'date-time' },
                expected_returning_date: { type: 'string', format: 'date-time' },
              },
              required: [
                'reservation_purpose',
                'start_location',
                'reservation_destination',
                'departure_date',
                'expected_returning_date',
              ],
            },
            CancelReservation: {
              type: 'object',
              properties: {
                reason: { type: 'string' },
              },
              required: ['reason'],
            },
            UpdateReservationStatus: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                reason: { type: 'string' },
              },
              required: ['status'],
            },
            AssignVehicle: {
              type: 'object',
              properties: {
                vehicle_id: { type: 'string' },
              },
              required: ['vehicle_id'],
            },
            StartReservation: {
              type: 'object',
              properties: {
                starting_odometer: { type: 'integer' },
                fuel_provided: { type: 'integer' },
              },
              required: ['starting_odometer', 'fuel_provided'],
            },
            CompleteReservation: {
              type: 'object',
              properties: {
                returned_odometer: { type: 'integer' },
              },
              required: ['returned_odometer'],
            },
          },
        },
      },
    },
  },
  apis: ['src/**/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
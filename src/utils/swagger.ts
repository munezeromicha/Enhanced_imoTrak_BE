import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { object } from 'zod';

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
      { url: 'https://imoteack.onrender.com' },
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
            reservations: {
              type: 'object',
              properties: {
                create: { type: 'boolean' },
                view: { type: 'boolean' },
                update: { type: 'boolean' },
                delete: { type: 'boolean' },
                cancel: { type: 'boolean' },
                approve: { type: 'boolean' },
                assignVehicle: { type: 'boolean' },
                odometerFuel: { type: 'boolean' },
                start: { type: 'boolean' },
                complete: { type: 'boolean' },
                viewOwn: { type: 'boolean' },
                updateReason: { type: 'boolean' },
              },
            },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            reservation_id: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
            reservation_purpose: { type: 'string' },
            start_location: { type: 'string' },
            reservation_destination: { type: 'string' },
            departure_date: { type: 'string', format: 'date-time' },
            expected_returning_date: { type: 'string', format: 'date-time' },
            reservation_status: { type: 'string' },
            reviewed_at: { type: 'string', format: 'date-time', nullable: true },
            rejection_comment: { type: 'string', nullable: true },
            user_id: { type: 'string', format: 'uuid' },
            reserved_vehicles: { type: 'array', items: { type: 'object' } },
          },
        },
        CreateReservation: {
          type: 'object',
          properties: {
            reservation_purpose: { type: 'string', example: 'Business meeting' },
            start_location: { type: 'string', example: 'Kigali HQ' },
            reservation_destination: { type: 'string', example: 'Musanze Branch' },
            departure_date: { type: 'string', format: 'date-time', example: '2024-08-01T09:00:00Z' },
            expected_returning_date: { type: 'string', format: 'date-time', example: '2024-08-01T18:00:00Z' },
          },
          required: [
            'reservation_purpose',
            'start_location',
            'reservation_destination',
            'departure_date',
            'expected_returning_date',
          ],
        },
        OdometerFuel: {
          type: 'object',
          properties: {
            starting_odometer: { type: 'integer', example: 12000 },
            fuel_provided: { type: 'integer', example: 50 },
          },
          required: ['starting_odometer', 'fuel_provided'],
        },
        CancelReservation: {
          type: 'object',
          properties: {
            reason: { type: 'string', example: 'Change of plans' },
          },
          required: ['reason'],
        },
        UpdateReservationStatus: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'APPROVED' },
            reason: { type: 'string', example: 'All requirements met' },
          },
          required: ['status'],
        },
        AssignVehicle: {
          type: 'object',
          properties: {
            vehicle_id: { type: 'string', format: 'uuid', example: 'c4d5e6f7-1234-5678-9abc-def012345678' },
          },
          required: ['vehicle_id'],
        },
        StartReservation: {
          type: 'object',
          properties: {},
          required: [],
        },
        CompleteReservation: {
          type: 'object',
          properties: {
            returned_odometer: { type: 'integer', example: 12500 },
          },
          required: ['returned_odometer'],
        },
        Notification: {
          type: 'object',
          properties: {
            notification_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            notification_title: { type: 'string' },
            notification_message: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        vehicleIssues: {
          type: 'object',
          properties: {
            report: { type: 'boolean' },
            view: { type: 'boolean' },
            update: { type: 'boolean' },
            delete: { type: 'boolean' },
          },
        },
      },
    },
  },
  apis: ['src/**/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };

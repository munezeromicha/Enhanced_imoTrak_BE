"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganizationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createOrganizationSchema = joi_1.default.object({
    organization_name: joi_1.default.string().trim().required().messages({
        'string.base': 'Organization name must be a string',
        'string.empty': 'Organization name is required',
        'any.required': 'Organization name is required',
    }),
    street_address: joi_1.default.string().trim().required().messages({
        'string.base': 'Street address must be a string',
        'string.empty': 'Street address is required',
        'any.required': 'Street address is required',
    }),
    organization_phone: joi_1.default.string().trim().required().messages({
        'string.base': 'Phone number must be a string',
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
    }),
    organization_email: joi_1.default.string().trim().email().required().messages({
        'string.email': 'Must be a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    organization_logo: joi_1.default.any().optional().meta({ swaggerType: 'file' }).description('Logo file (optional)'), // used for form-data
});

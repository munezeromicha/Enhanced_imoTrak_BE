"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreatePosition = exports.validateCreateUnit = exports.validateCreateOrganization = void 0;
const org_validator_1 = require("../utils/org.validator");
const joi_1 = __importDefault(require("joi"));
const validateCreateOrganization = (req, res, next) => {
    const { error } = org_validator_1.createOrganizationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            errors: error.details.map((detail) => detail.message),
        });
    }
    next();
};
exports.validateCreateOrganization = validateCreateOrganization;
const createUnitSchema = joi_1.default.object({
    unit_name: joi_1.default.string().required().messages({
        'string.base': 'Unit name must be a string',
        'any.required': 'Unit name is required',
    }),
    organization_id: joi_1.default.string().uuid().required().messages({
        'string.base': 'Organization ID must be a string',
        'string.guid': 'Organization ID must be a valid UUID',
        'any.required': 'Organization ID is required',
    }),
});
const validateCreateUnit = (req, res, next) => {
    const { error } = createUnitSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
exports.validateCreateUnit = validateCreateUnit;
const createPositionSchema = joi_1.default.object({
    position_name: joi_1.default.string().optional(),
    position_description: joi_1.default.string().optional(),
    position_access: joi_1.default.object().required(),
    unit_id: joi_1.default.string().uuid().required(),
});
const validateCreatePosition = (req, res, next) => {
    const { error } = createPositionSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            details: error.details.map((d) => d.message),
        });
    }
    next();
};
exports.validateCreatePosition = validateCreatePosition;

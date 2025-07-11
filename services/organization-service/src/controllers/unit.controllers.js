"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetUnitsByOrg = exports.handleGetAllUnits = exports.handleCreateUnit = void 0;
const unit_services_1 = require("../services/unit.services");
const handleCreateUnit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unit_name, organization_id } = req.body;
        const unit = yield (0, unit_services_1.createUnit)({
            unit_name,
            organization_id,
        });
        res.status(201).json({
            message: 'Unit created successfully',
            data: unit,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleCreateUnit = handleCreateUnit;
const handleGetAllUnits = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const units = yield (0, unit_services_1.getAllUnits)();
        res.status(200).json({
            message: 'Units fetched successfully',
            data: units,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleGetAllUnits = handleGetAllUnits;
const handleGetUnitsByOrg = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organization_id } = req.params;
        const units = yield (0, unit_services_1.getUnitsByOrganization)(organization_id);
        res.status(200).json({
            message: 'Units fetched successfully for organization',
            data: units,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleGetUnitsByOrg = handleGetUnitsByOrg;

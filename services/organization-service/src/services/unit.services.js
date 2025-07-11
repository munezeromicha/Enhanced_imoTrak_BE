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
exports.getUnitsByOrganization = exports.getAllUnits = exports.createUnit = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUnit = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tbl_unit.create({
        data,
    });
});
exports.createUnit = createUnit;
const getAllUnits = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tbl_unit.findMany({
        include: {
            tbl_organizations: true, // Optional: include related organization
        },
    });
});
exports.getAllUnits = getAllUnits;
const getUnitsByOrganization = (organization_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tbl_unit.findMany({
        where: { organization_id },
        include: {
            tbl_organizations: true, // Optional
        },
    });
});
exports.getUnitsByOrganization = getUnitsByOrganization;

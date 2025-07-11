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
exports.handleGetAllOrganizations = exports.handleCreateOrganization = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const org_services_1 = require("../services/org.services");
const uuid_1 = require("uuid");
const handleCreateOrganization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { organization_name, street_address, organization_phone, organization_email, } = req.body;
        let logoUrl;
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer) {
            const upload = yield (0, cloudinary_1.uploadBufferToCloudinary)(req.file.buffer, 'imotarak/organisations/logos');
            logoUrl = upload.url;
        }
        const organization = yield (0, org_services_1.createOrganization)({
            organization_name,
            street_address,
            organization_phone,
            organization_email,
            organization_logo: logoUrl !== null && logoUrl !== void 0 ? logoUrl : '',
            organization_customId: `ORG-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`
        });
        res.status(201).json({
            message: 'Organization created successfully',
            data: organization,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleCreateOrganization = handleCreateOrganization;
const handleGetAllOrganizations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizations = yield (0, org_services_1.getAllOrganizations)();
        res.status(200).json({
            message: 'Organizations fetched successfully',
            data: organizations,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleGetAllOrganizations = handleGetAllOrganizations;

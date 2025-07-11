"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const org_routes_1 = __importDefault(require("./org.routes"));
const unit_routes_1 = __importDefault(require("./unit.routes"));
const position_routes_1 = __importDefault(require("./position.routes"));
const router = (0, express_1.Router)();
router.use('/', org_routes_1.default);
router.use('/units', unit_routes_1.default);
router.use('/positions', position_routes_1.default);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const UserDb_1 = __importDefault(require("../database/UserDb"));
const jwt_1 = require("../auth/jwt");
const router = express_1.default.Router();
const userDb = new UserDb_1.default();
router.post('/', function (req, res) {
    const userJson = {
        name: req.body.name,
    };
    const userModel = User_1.default.fromJson(userJson);
    userDb.create(userModel).then((createdUser) => {
        res.status(201).send(`Bearer ${(0, jwt_1.generateAccessToken)(createdUser)}`);
    });
});
exports.default = router;

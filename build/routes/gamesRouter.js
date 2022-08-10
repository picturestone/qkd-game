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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GameDb_1 = __importDefault(require("../database/GameDb"));
const router = express_1.default.Router();
const gameDb = new GameDb_1.default();
// TODO extend with eve
router.get('/:id', function (req, res) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const game = yield gameDb.findById(req.params.id);
        if (game && game.id) {
            const aliceId = game.alicePlayer.controller.userId;
            const bobId = game.bobPlayer.controller.userId;
            const eveId = (_a = game.evePlayer) === null || _a === void 0 ? void 0 : _a.controller.userId;
            if ((aliceId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) === aliceId) ||
                (bobId && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) === bobId) ||
                (eveId && ((_d = req.user) === null || _d === void 0 ? void 0 : _d.id) === eveId)) {
                res.send(game.toJson());
            }
            else {
                res.status(401).send();
            }
        }
        else {
            res.status(404).send();
        }
    });
});
exports.default = router;

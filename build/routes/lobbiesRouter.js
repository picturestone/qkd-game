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
const LobbyDb_1 = __importDefault(require("../database/LobbyDb"));
const Lobby_1 = __importDefault(require("../models/Lobby"));
const router = express_1.default.Router();
const lobbyDb = new LobbyDb_1.default();
router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyJson = new Array();
        const lobbies = yield lobbyDb.findAll();
        lobbies.map((lobbyModel) => {
            lobbyJson.push(lobbyModel.toJson());
        });
        res.send(lobbyJson);
    });
});
router.get('/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobby = yield lobbyDb.findById(req.params.id);
        if (lobby) {
            res.send(lobby.toJson());
        }
        else {
            res.status(404).send();
        }
    });
});
router.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyJson = {
            name: req.body.name,
            owner: req.body.owner,
            noOfQbits: req.body.noOfQbits,
            isEveAllowed: req.body.isEveAllowed,
        };
        const lobbyModel = Lobby_1.default.fromJson(lobbyJson);
        const savedLobby = yield lobbyDb.create(lobbyModel);
        res.status(201).send(savedLobby.toJson());
    });
});
exports.default = router;

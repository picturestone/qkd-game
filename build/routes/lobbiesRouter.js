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
const LobbyDb_1 = __importDefault(require("../database/LobbyDb"));
const Game_1 = __importDefault(require("../models/Game"));
const Lobby_1 = __importDefault(require("../models/Lobby"));
const IO_1 = __importDefault(require("../sockets/IO"));
const UserAliceController_1 = __importDefault(require("../models/player/UserAliceController"));
const UserBobController_1 = __importDefault(require("../models/player/UserBobController"));
const router = express_1.default.Router();
const lobbyDb = new LobbyDb_1.default();
const gameDb = new GameDb_1.default();
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
            res.status(404);
        }
    });
});
router.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const lobbyJson = {
            name: req.body.name,
            owner: req.body.owner,
        };
        const lobbyModel = Lobby_1.default.fromJson(lobbyJson);
        const savedLobby = yield lobbyDb.create(lobbyModel);
        res.status(201).send(savedLobby.toJson());
    });
});
router.post('/:id/start', function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const lobby = yield lobbyDb.findById(req.params.id);
        if (lobby && lobby.id) {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === lobby.owner.id) {
                if (lobby.reservedAlice &&
                    lobby.reservedAlice.socketId &&
                    lobby.reservedBob &&
                    lobby.reservedBob.socketId) {
                    const ioServer = IO_1.default.getInstance().server;
                    // Make all sockets in the lobby room leave.
                    ioServer.in(lobby.id).socketsLeave(lobby.id);
                    const aliceController = new UserAliceController_1.default(lobby.reservedAlice);
                    const bobController = new UserBobController_1.default(lobby.reservedBob);
                    const game = new Game_1.default(aliceController, bobController);
                    const savedGame = yield gameDb.create(game);
                    savedGame.startGame();
                    // TODO maybe send game as json.
                    res.status(201).send();
                }
                else {
                    res.statusMessage =
                        'Alice and Bob roles have not been taken, or their sockets are not connected';
                    res.status(400);
                }
            }
            else {
                res.status(401);
            }
        }
        else {
            res.status(404);
        }
    });
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameDb_1 = __importDefault(require("../database/GameDb"));
const Qbit_1 = __importDefault(require("../models/quantum/Qbit"));
function isGameExisting(gameId) {
    return new Promise((res, rej) => {
        new GameDb_1.default().findById(gameId).then((game) => {
            if (game && game.id) {
                res(game);
            }
            else {
                rej();
            }
        });
    });
}
function getUserId(socket) {
    var _a;
    return (_a = socket.request.user) === null || _a === void 0 ? void 0 : _a.id;
}
function isUserAlice(inGame, userId) {
    let controller = undefined;
    if (userId) {
        const aliceController = inGame.alicePlayer.controller;
        if (userId === aliceController.userId) {
            controller = aliceController;
        }
    }
    return controller;
}
function isUserBob(inGame, userId) {
    let controller = undefined;
    if (userId) {
        const bobController = inGame.bobPlayer.controller;
        if (userId === bobController.userId) {
            controller = bobController;
        }
    }
    return controller;
}
function isUserEve(inGame, userId) {
    var _a;
    let controller = undefined;
    if (userId) {
        const eveController = (_a = inGame.evePlayer) === null || _a === void 0 ? void 0 : _a.controller;
        if (eveController && userId === eveController.userId) {
            controller = eveController;
        }
    }
    return controller;
}
// TODO add redirecting on missing auth.
// TODO quit game when leaving.
function registerSocketIOEvents(server) {
    server.on('connect', (socket) => {
        socket.on('sendQbit', (gameId, qbitJson) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const aliceController = isUserAlice(game, userId);
                const eveController = isUserEve(game, userId);
                const sentQbit = Qbit_1.default.fromJson(qbitJson);
                if (aliceController) {
                    aliceController.sendQbit(sentQbit);
                }
                else if (eveController) {
                    eveController.sendQbit(sentQbit);
                }
            });
        });
        socket.on('measureEnqueuedQbit', (gameId, basis, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const bobController = isUserBob(game, userId);
                const eveController = isUserEve(game, userId);
                if (bobController) {
                    const measuredPolarization = bobController.measureEnqueuedQbit(basis);
                    cb(measuredPolarization);
                }
                else if (eveController) {
                    const measuredPolarization = eveController.measureEnqueuedQbit(basis);
                    cb(measuredPolarization);
                }
            });
        });
        socket.on('publishBasis', (gameId, basisComparisonData, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const aliceController = isUserAlice(game, userId);
                const eveController = isUserEve(game, userId);
                if (aliceController) {
                    aliceController.controlledPlayer.sendBasisComparison(basisComparisonData);
                    cb(basisComparisonData);
                }
                else if (eveController) {
                    eveController.controlledPlayer.sendBasisComparison(basisComparisonData);
                    cb(basisComparisonData);
                }
            });
        });
        socket.on('publishDiscard', (gameId, qbitDiscardedData, cb) => {
            isGameExisting(gameId).then((game) => {
                const userId = getUserId(socket);
                const bobController = isUserBob(game, userId);
                const eveController = isUserEve(game, userId);
                if (bobController) {
                    bobController.controlledPlayer.sendQbitDiscard(qbitDiscardedData);
                    cb(qbitDiscardedData);
                }
                else if (eveController) {
                    eveController.controlledPlayer.sendQbitDiscard(qbitDiscardedData);
                    cb(qbitDiscardedData);
                }
            });
        });
    });
}
exports.default = registerSocketIOEvents;

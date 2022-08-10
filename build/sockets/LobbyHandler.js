"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameDb_1 = __importDefault(require("../database/GameDb"));
const LobbyDb_1 = __importDefault(require("../database/LobbyDb"));
const GameFactory_1 = __importDefault(require("../models/GameFactory"));
const HumanAliceController_1 = __importDefault(require("../models/player/HumanAliceController"));
const HumanBobController_1 = __importDefault(require("../models/player/HumanBobController"));
const HumanEveController_1 = __importDefault(require("../models/player/HumanEveController"));
const PlayerRole_1 = require("../qkd-game-client/src/models/api/PlayerRole");
const IO_1 = __importDefault(require("./IO"));
function removeFromOtherRoles(user, lobby) {
    var _a, _b;
    if (user) {
        const userId = user.id;
        if (((_a = lobby.reservedAlice) === null || _a === void 0 ? void 0 : _a.id) === userId) {
            lobby.reservedAlice = undefined;
        }
        if (((_b = lobby.reservedBob) === null || _b === void 0 ? void 0 : _b.id) === userId) {
            lobby.reservedBob = undefined;
        }
    }
}
function startAliceBobGame(lobby, server) {
    if (lobby.reservedAlice &&
        lobby.reservedAlice.socketId &&
        lobby.reservedBob &&
        lobby.reservedBob.socketId &&
        lobby.id) {
        // Make all sockets in the lobby room leave.
        const ioServer = IO_1.default.getInstance().server;
        ioServer.in(lobby.id).socketsLeave(lobby.id);
        // Create game.
        const aliceController = new HumanAliceController_1.default(lobby.reservedAlice);
        const bobController = new HumanBobController_1.default(lobby.reservedBob);
        const game = GameFactory_1.default.createAliceBobGame(lobby.noOfQbits, aliceController, bobController);
        new GameDb_1.default().create(game).then((savedGame) => {
            if (lobby && lobby.id) {
                // Delete old lobby.
                new LobbyDb_1.default().delete(lobby.id).then(() => {
                    // Notify users.
                    savedGame.startGame();
                });
            }
        });
    }
    else if (lobby.id) {
        server
            .to(lobby.id)
            .emit('chatMessage', `Game can only start if the Alice and Bob roles are occupied.`);
    }
}
function startAliceBobEveGame(lobby, server) {
    if (lobby.reservedAlice &&
        lobby.reservedAlice.socketId &&
        lobby.reservedBob &&
        lobby.reservedBob.socketId &&
        lobby.reservedEve &&
        lobby.reservedEve.socketId &&
        lobby.id) {
        // Make all sockets in the lobby room leave.
        const ioServer = IO_1.default.getInstance().server;
        ioServer.in(lobby.id).socketsLeave(lobby.id);
        // Create game. TODO create game with eve
        const aliceController = new HumanAliceController_1.default(lobby.reservedAlice);
        const bobController = new HumanBobController_1.default(lobby.reservedBob);
        const eveController = new HumanEveController_1.default(lobby.reservedEve);
        const game = GameFactory_1.default.createAliceBobEveGame(lobby.noOfQbits, aliceController, bobController, eveController);
        new GameDb_1.default().create(game).then((savedGame) => {
            if (lobby && lobby.id) {
                // Delete old lobby.
                new LobbyDb_1.default().delete(lobby.id).then(() => {
                    // Notify users.
                    savedGame.startGame();
                });
            }
        });
    }
    else if (lobby.id) {
        server
            .to(lobby.id)
            .emit('chatMessage', `Game can only start if the Alice, Bob and Eve roles are occupied.`);
    }
}
// TODO close lobby when leaving.
function registerSocketIOEvents(server) {
    server.on('connect', (socket) => {
        socket.on('joinLobby', (lobbyId) => {
            new LobbyDb_1.default().findById(lobbyId).then((lobby) => {
                var _a;
                if (lobby && lobby.id && !socket.rooms.has(lobby.id)) {
                    socket.join(lobby.id);
                    server
                        .to(lobby.id)
                        .emit('chatMessage', `${(_a = socket.request.user) === null || _a === void 0 ? void 0 : _a.name} joined the lobby.`);
                }
            });
        });
        socket.on('selectLobbyRole', (lobbyId, lobbyRole) => {
            const lobbyDb = new LobbyDb_1.default();
            lobbyDb.findById(lobbyId).then((lobby) => {
                if (lobby && lobby.id) {
                    if (lobbyRole === null || lobbyRole === undefined) {
                        removeFromOtherRoles(socket.request.user, lobby);
                        lobbyDb.put(lobby).then((updatedLobby) => {
                            var _a;
                            if (updatedLobby && updatedLobby.id) {
                                server
                                    .to(updatedLobby.id)
                                    .emit('updatedLobby', updatedLobby.toJson());
                                server
                                    .to(updatedLobby.id)
                                    .emit('chatMessage', `${(_a = socket.request.user) === null || _a === void 0 ? void 0 : _a.name} deselected their role.`);
                            }
                        });
                    }
                    else {
                        switch (lobbyRole) {
                            case PlayerRole_1.PLAYERROLE.alice:
                                if (!lobby.reservedAlice) {
                                    removeFromOtherRoles(socket.request.user, lobby);
                                    lobby.reservedAlice = socket.request.user;
                                }
                                break;
                            case PlayerRole_1.PLAYERROLE.bob:
                                if (!lobby.reservedBob) {
                                    removeFromOtherRoles(socket.request.user, lobby);
                                    lobby.reservedBob = socket.request.user;
                                }
                                break;
                            case PlayerRole_1.PLAYERROLE.eve:
                                if (!lobby.reservedEve) {
                                    removeFromOtherRoles(socket.request.user, lobby);
                                    lobby.reservedEve = socket.request.user;
                                }
                        }
                        lobbyDb.put(lobby).then((updatedLobby) => {
                            var _a;
                            if (updatedLobby && updatedLobby.id) {
                                server
                                    .to(updatedLobby.id)
                                    .emit('updatedLobby', updatedLobby.toJson());
                                server
                                    .to(updatedLobby.id)
                                    .emit('chatMessage', `${(_a = socket.request.user) === null || _a === void 0 ? void 0 : _a.name} plays as ${lobbyRole}.`);
                            }
                        });
                    }
                }
            });
        });
        // TODO start game with eve.
        socket.on('startGame', (lobbyId) => {
            new LobbyDb_1.default().findById(lobbyId).then((lobby) => {
                var _a;
                if (lobby && lobby.id) {
                    if (((_a = socket.request.user) === null || _a === void 0 ? void 0 : _a.id) === lobby.owner.id) {
                        if (lobby.isEveAllowed) {
                            startAliceBobEveGame(lobby, server);
                        }
                        else {
                            startAliceBobGame(lobby, server);
                        }
                    } // TODO maybe send unauthorized in else.
                } // TODO maybe send 404 in else.
            });
        });
    });
}
exports.default = registerSocketIOEvents;

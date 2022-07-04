"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LobbyDb_1 = __importDefault(require("../database/LobbyDb"));
const PlayerRole_1 = require("../qkd-game-client/src/models/api/PlayerRole");
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
                    // TODO remove user from other reserved roles.
                    switch (lobbyRole) {
                        case PlayerRole_1.PLAYERROLE.alice:
                            if (!lobby.reservedAlice) {
                                lobby.reservedAlice = socket.request.user;
                            }
                            break;
                        case PlayerRole_1.PLAYERROLE.bob:
                            if (!lobby.reservedBob) {
                                lobby.reservedBob = socket.request.user;
                            }
                            break;
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
            });
        });
    });
}
exports.default = registerSocketIOEvents;

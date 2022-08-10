"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class LobbyDb {
    create(lobby) {
        return new Promise((res) => {
            lobby.id = (0, uuid_1.v4)();
            LobbyDb._lobbies.push(lobby);
            res(lobby);
        });
    }
    findById(id) {
        return new Promise((res) => {
            const lobby = LobbyDb._lobbies.find((lobby) => lobby.id === id);
            res(lobby);
        });
    }
    put(updatedLobby) {
        return new Promise((res) => {
            const lobbyIndex = LobbyDb._lobbies.findIndex((lobby) => lobby.id === updatedLobby.id);
            if (lobbyIndex === -1) {
                res(undefined);
            }
            else {
                LobbyDb._lobbies[lobbyIndex] = updatedLobby;
                res(updatedLobby);
            }
        });
    }
    findAll() {
        return new Promise((res) => {
            res(LobbyDb._lobbies);
        });
    }
    delete(id) {
        return new Promise((res) => {
            const index = LobbyDb._lobbies.findIndex((lobby) => lobby.id === id);
            const removedLobbies = LobbyDb._lobbies.splice(index, 1);
            let retVal = undefined;
            if (removedLobbies.length > 0) {
                retVal = removedLobbies[0];
            }
            res(retVal);
        });
    }
}
exports.default = LobbyDb;
// TODO use database instead of in-memory
LobbyDb._lobbies = new Array();

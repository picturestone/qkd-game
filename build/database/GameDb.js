"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class GameDb {
    create(game) {
        return new Promise((res) => {
            game.id = (0, uuid_1.v4)();
            GameDb._games.push(game);
            res(game);
        });
    }
    findById(id) {
        return new Promise((res) => {
            const game = GameDb._games.find((game) => game.id === id);
            res(game);
        });
    }
}
exports.default = GameDb;
// TODO use database instead of in-memory
GameDb._games = new Array();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(role) {
        this._role = role;
    }
    get role() {
        return this._role;
    }
}
exports.default = Player;

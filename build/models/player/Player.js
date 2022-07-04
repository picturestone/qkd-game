"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(controller) {
        this._controller = controller;
        controller.controlledPlayer = this;
    }
    get controller() {
        return this._controller;
    }
}
exports.default = Player;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(controller) {
        controller.controlledPlayer = this;
    }
}
exports.default = Player;

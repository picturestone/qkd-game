"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerController {
    set controlledPlayer(controlledPlayer) {
        this._controlledPlayer = controlledPlayer;
    }
    get controlledPlayer() {
        if (this._controlledPlayer) {
            return this._controlledPlayer;
        }
        else {
            throw new Error('ControlledPlayer must be set');
        }
    }
}
exports.default = PlayerController;

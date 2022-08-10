"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor(noOfQbits, alicePlayer, bobPlayer, evePlayer, id) {
        this.isStartet = false;
        this._id = id;
        this._noOfQbits = noOfQbits;
        this._alicePlayer = alicePlayer;
        this._bobPlayer = bobPlayer;
        this._evePlayer = evePlayer;
    }
    startGame() {
        var _a;
        if (!this.isStartet) {
            this._alicePlayer.controller.startGame(this);
            this._bobPlayer.controller.startGame(this);
            (_a = this._evePlayer) === null || _a === void 0 ? void 0 : _a.controller.startGame(this);
            this.isStartet = true;
        }
    }
    set id(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    get alicePlayer() {
        return this._alicePlayer;
    }
    get bobPlayer() {
        return this._bobPlayer;
    }
    get evePlayer() {
        return this._evePlayer;
    }
    toJson() {
        return {
            id: this._id,
            noOfQbits: this._noOfQbits,
        };
    }
}
exports.default = Game;

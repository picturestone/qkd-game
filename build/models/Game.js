"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuantumChannel_1 = __importDefault(require("./channel/QuantumChannel"));
const AlicePlayer_1 = __importDefault(require("./player/AlicePlayer"));
const BobPlayer_1 = __importDefault(require("./player/BobPlayer"));
class Game {
    constructor(aliceController, bobController, id) {
        this.isStartet = false;
        this._id = id;
        const aliceBobQuantumConnection = new QuantumChannel_1.default();
        this._alicePlayer = new AlicePlayer_1.default(aliceController, aliceBobQuantumConnection);
        this._bobPlayer = new BobPlayer_1.default(bobController, aliceBobQuantumConnection);
    }
    startGame() {
        if (!this.isStartet) {
            this._alicePlayer.controller.startGame();
            this._bobPlayer.controller.startGame();
            this.isStartet = true;
        }
    }
    set id(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
}
exports.default = Game;

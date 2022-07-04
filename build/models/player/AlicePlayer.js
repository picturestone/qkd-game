"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("./Player"));
class AlicePlayer extends Player_1.default {
    // TODO add classical channel: ISource<confirmation> or something.
    constructor(controller, quantumChannel) {
        super(controller);
        this._quantumChannel = quantumChannel;
    }
    sendQbit(qbit) {
        this._quantumChannel.enqueue(qbit);
    }
}
exports.default = AlicePlayer;

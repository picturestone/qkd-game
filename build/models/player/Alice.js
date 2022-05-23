"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerRole_1 = __importDefault(require("./PlayerRole"));
class Alice extends PlayerRole_1.default {
    // TODO add classical channel: ISource<confirmation> or something.
    constructor(quantumChannel) {
        super();
        this._quantumChannel = quantumChannel;
    }
    sendQbit(qbit) {
        this._quantumChannel.enqueue(qbit);
    }
}
exports.default = Alice;

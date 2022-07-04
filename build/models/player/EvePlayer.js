"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("./Player"));
class EvePlayer extends Player_1.default {
    constructor(source, sink) {
        super();
        this._source = source;
        this._sink = sink;
    }
}
exports.default = EvePlayer;

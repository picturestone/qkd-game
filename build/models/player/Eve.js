"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerRole_1 = __importDefault(require("./PlayerRole"));
class Eve extends PlayerRole_1.default {
    constructor(source, sink) {
        super();
        this._source = source;
        this._sink = sink;
    }
}
exports.default = Eve;

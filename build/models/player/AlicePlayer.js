"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("./Player"));
class AlicePlayer extends Player_1.default {
    constructor(controller, quantumChannel, basisComparisonChannel, qbitDiscardChannel) {
        super(controller);
        this._controller = controller;
        this._quantumChannel = quantumChannel;
        this._basisComparisonChannel = basisComparisonChannel;
        this._qbitDiscardChannel = qbitDiscardChannel;
        this._qbitDiscardChannel.addObserver(this);
    }
    get controller() {
        return this._controller;
    }
    onQbitDiscardEnqueue() {
        this._controller.onQbitDiscardEnqueue();
    }
    sendQbit(qbit) {
        this._quantumChannel.enqueue(qbit);
    }
    sendBasisComparison(basisComparison) {
        this._basisComparisonChannel.enqueue(basisComparison);
    }
    dequeueQbitDiscard() {
        return this._qbitDiscardChannel.dequeue();
    }
}
exports.default = AlicePlayer;

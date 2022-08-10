"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("./Player"));
class BobPlayer extends Player_1.default {
    constructor(controller, quantumChannel, basisComparisonChannel, qbitDiscardChannel) {
        super(controller);
        this._controller = controller;
        this._quantumChannel = quantumChannel;
        this._quantumChannel.addObserver(this);
        this._basisComparisonChannel = basisComparisonChannel;
        this._basisComparisonChannel.addObserver(this);
        this._qbitDiscardChannel = qbitDiscardChannel;
    }
    get controller() {
        return this._controller;
    }
    onBasisComparisonEnqueue() {
        this._controller.onBasisComparisonEnqueue();
    }
    onQbitEnqueue() {
        this._controller.onQbitEnqueue();
    }
    dequeueQbit() {
        return this._quantumChannel.dequeue();
    }
    dequeueBasisComparison() {
        return this._basisComparisonChannel.dequeue();
    }
    sendQbitDiscard(qbitDiscard) {
        this._qbitDiscardChannel.enqueue(qbitDiscard);
    }
}
exports.default = BobPlayer;

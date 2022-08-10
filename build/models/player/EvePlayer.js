"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("./Player"));
class EvePlayer extends Player_1.default {
    constructor(controller, sourceQuantumChannel, sinkQuantumChannel, sourceBasisComparisonChannel, sinkBasisComparisonChannel, sourceQbitDiscardChannel, sinkQbitDiscardChannel) {
        super(controller);
        this._controller = controller;
        this._sourceQuantumChannel = sourceQuantumChannel;
        this._sourceQuantumChannel.addObserver(this);
        this._sinkQuantumChannel = sinkQuantumChannel;
        this._sourceBasisComparisonChannel = sourceBasisComparisonChannel;
        this._sourceBasisComparisonChannel.addObserver(this);
        this._sinkBasisComparisonChannel = sinkBasisComparisonChannel;
        this._sourceQbitDiscardChannel = sourceQbitDiscardChannel;
        this._sourceQbitDiscardChannel.addObserver(this);
        this._sinkQbitDiscardChannel = sinkQbitDiscardChannel;
    }
    get controller() {
        return this._controller;
    }
    onQbitDiscardEnqueue() {
        this._controller.onQbitDiscardEnqueue();
    }
    sendQbit(qbit) {
        this._sinkQuantumChannel.enqueue(qbit);
    }
    sendBasisComparison(basisComparison) {
        this._sinkBasisComparisonChannel.enqueue(basisComparison);
    }
    dequeueQbitDiscard() {
        return this._sourceQbitDiscardChannel.dequeue();
    }
    onBasisComparisonEnqueue() {
        this._controller.onBasisComparisonEnqueue();
    }
    onQbitEnqueue() {
        this._controller.onQbitEnqueue();
    }
    dequeueQbit() {
        return this._sourceQuantumChannel.dequeue();
    }
    dequeueBasisComparison() {
        return this._sourceBasisComparisonChannel.dequeue();
    }
    sendQbitDiscard(qbitDiscard) {
        this._sinkQbitDiscardChannel.enqueue(qbitDiscard);
    }
}
exports.default = EvePlayer;

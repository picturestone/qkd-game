"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = __importDefault(require("./Channel"));
class QuantumChannel extends Channel_1.default {
    constructor() {
        super();
        this._queue = [];
        this._observers = [];
    }
    dequeue() {
        return this._queue.shift();
    }
    enqueue(value) {
        this._queue.push(value);
        this.notifyObservers();
    }
    notifyObservers() {
        this._observers.forEach((observer) => {
            observer.onBasisComparisonEnqueue();
        });
    }
    addObserver(observer) {
        this._observers.push(observer);
    }
}
exports.default = QuantumChannel;

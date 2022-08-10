"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = __importDefault(require("./Channel"));
class QuantumChannel extends Channel_1.default {
    constructor() {
        super();
        this._qbitQueue = [];
        this._observers = [];
    }
    dequeue() {
        return this._qbitQueue.shift();
    }
    enqueue(value) {
        this._qbitQueue.push(value);
        this.notifyObservers();
    }
    notifyObservers() {
        this._observers.forEach((observer) => {
            observer.onQbitEnqueue();
        });
    }
    addObserver(observer) {
        this._observers.push(observer);
    }
}
exports.default = QuantumChannel;

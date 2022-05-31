"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = __importDefault(require("./Channel"));
class QuantumChannel extends Channel_1.default {
    constructor() {
        super();
        this.qbitQueue = [];
    }
    dequeue() {
        return this.qbitQueue.shift();
    }
    enqueue(value) {
        this.qbitQueue.push(value);
        super.notifyObservers();
    }
}
exports.default = QuantumChannel;

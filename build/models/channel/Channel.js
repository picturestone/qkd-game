"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Channel {
    constructor() {
        this._observers = [];
    }
    notifyObservers() {
        this._observers.forEach(observer => {
            observer.onEnqueue(this);
        });
    }
    ;
    addObserver(observer) {
        this._observers.push(observer);
    }
}
exports.default = Channel;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(name, id) {
        this._name = name;
        this._id = id;
    }
    set id(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set socketId(socketId) {
        this._socketId = socketId;
    }
    get socketId() {
        return this._socketId;
    }
    static fromJson(json) {
        return new User(json.name, json.id);
    }
    toJson() {
        return {
            name: this._name,
            id: this._id,
        };
    }
}
exports.default = User;

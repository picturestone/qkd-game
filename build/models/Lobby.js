"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class Lobby {
    constructor(name, owner, noOfQbits, isEveAllowed, id, reservedAlice, reservedBob, reservedEve) {
        this._name = name;
        this._owner = owner;
        this._id = id;
        this._isEveAllowed = isEveAllowed;
        this._reservedAlice = reservedAlice;
        this._reservedBob = reservedBob;
        this._reservedEve = reservedEve;
        this._noOfQbits = noOfQbits;
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
    set owner(owner) {
        this._owner = owner;
    }
    get owner() {
        return this._owner;
    }
    get reservedEve() {
        return this._reservedEve;
    }
    set reservedEve(value) {
        this._reservedEve = value;
    }
    get reservedAlice() {
        return this._reservedAlice;
    }
    set reservedAlice(value) {
        this._reservedAlice = value;
    }
    get reservedBob() {
        return this._reservedBob;
    }
    set reservedBob(value) {
        this._reservedBob = value;
    }
    set noOfQbits(value) {
        this._noOfQbits = value;
    }
    get noOfQbits() {
        return this._noOfQbits;
    }
    get isEveAllowed() {
        return this._isEveAllowed;
    }
    set isEveAllowed(value) {
        this._isEveAllowed = value;
    }
    static fromJson(json) {
        const reservedAliceUser = json.reservedAlice
            ? User_1.default.fromJson(json.reservedAlice)
            : undefined;
        const reservedBobUser = json.reservedBob
            ? User_1.default.fromJson(json.reservedBob)
            : undefined;
        const reservedEveUser = json.reservedEve
            ? User_1.default.fromJson(json.reservedEve)
            : undefined;
        return new Lobby(json.name, User_1.default.fromJson(json.owner), json.noOfQbits, json.isEveAllowed, json.id, reservedAliceUser, reservedBobUser, reservedEveUser);
    }
    toJson() {
        var _a, _b, _c;
        return {
            name: this._name,
            owner: this._owner.toJson(),
            noOfQbits: this._noOfQbits,
            isEveAllowed: this._isEveAllowed,
            id: this._id,
            reservedAlice: (_a = this._reservedAlice) === null || _a === void 0 ? void 0 : _a.toJson(),
            reservedBob: (_b = this._reservedBob) === null || _b === void 0 ? void 0 : _b.toJson(),
            reservedEve: (_c = this._reservedEve) === null || _c === void 0 ? void 0 : _c.toJson(),
        };
    }
}
exports.default = Lobby;

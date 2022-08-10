"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IO_1 = __importDefault(require("../../sockets/IO"));
const AliceController_1 = __importDefault(require("./AliceController"));
class HumanAliceController extends AliceController_1.default {
    constructor(user) {
        super();
        this._user = user;
    }
    get socket() {
        if (this._user.socketId) {
            return IO_1.default.getInstance().server.to(this._user.socketId);
        }
        else {
            throw new Error('SocketID on alice user is not defined.');
        }
    }
    get userId() {
        return this._user.id;
    }
    startGame(game) {
        this.socket.emit('startedGame', game.toJson());
    }
    sendQbit(qbit) {
        this.controlledPlayer.sendQbit(qbit);
    }
    onQbitDiscardEnqueue() {
        const qbitDiscard = this.controlledPlayer.dequeueQbitDiscard();
        if (qbitDiscard) {
            this.socket.emit('discardPublished', qbitDiscard);
        }
    }
}
exports.default = HumanAliceController;

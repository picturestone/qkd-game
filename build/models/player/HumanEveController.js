"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IO_1 = __importDefault(require("../../sockets/IO"));
const EveController_1 = __importDefault(require("./EveController"));
class HumanEveController extends EveController_1.default {
    constructor(user) {
        super();
        this._user = user;
    }
    get socket() {
        if (this._user.socketId) {
            return IO_1.default.getInstance().server.to(this._user.socketId);
        }
        else {
            throw new Error('SocketID on eve user is not defined.');
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
    measureEnqueuedQbit(basis) {
        const qbit = this.controlledPlayer.dequeueQbit();
        let measuredPolarization = undefined;
        if (qbit) {
            measuredPolarization = qbit.measurePolarization(basis);
        }
        return measuredPolarization;
    }
    onQbitEnqueue() {
        this.socket.emit('qbitEnqueued');
    }
    onBasisComparisonEnqueue() {
        const basisComparison = this.controlledPlayer.dequeueBasisComparison();
        if (basisComparison) {
            this.socket.emit('basisPublished', basisComparison);
        }
    }
}
exports.default = HumanEveController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IO_1 = __importDefault(require("../../sockets/IO"));
const BobController_1 = __importDefault(require("./BobController"));
class UserBobController extends BobController_1.default {
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
    startGame() {
        this.socket.emit('startedGame');
    }
    receiveQbit(qbit) {
        throw new Error('Method not implemented.');
    }
}
exports.default = UserBobController;

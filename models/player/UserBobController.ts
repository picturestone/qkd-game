import IO from '../../sockets/IO';
import Qbit from '../quantum/Qbit';
import User from '../User';
import BobController from './BobController';

export default class UserBobController extends BobController {
    private _user: User;

    constructor(user: User) {
        super();
        this._user = user;
    }

    get socket() {
        if (this._user.socketId) {
            const socket = IO.getInstance().server.sockets.sockets.get(
                this._user.socketId
            );

            if (socket) {
                return socket;
            } else {
                throw new Error(
                    'Socket with id ' + this._user.socketId + ' not existing'
                );
            }
        } else {
            throw new Error('SocketID on alice user is not defined.');
        }
    }

    startGame(): void {
        this.socket.emit('startedGame');
    }

    receiveQbit(qbit: Qbit): void {
        throw new Error('Method not implemented.');
    }
}

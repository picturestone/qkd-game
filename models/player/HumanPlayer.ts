import IUser = Express.User;
import IO from '../../sockets/IO';

export default class HumanPlayer {
    private _user: IUser;

    constructor(user: IUser) {
        this._user = user;
    }

    get userId() {
        return this._user.id;
    }

    get socket() {
        if (this._user.socketId) {
            return IO.getInstance().server.to(this._user.socketId);
        } else {
            throw new Error('SocketID on alice user is not defined.');
        }
    }
}

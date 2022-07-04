import IO from '../../sockets/IO';
import Game from '../Game';
import Qbit from '../quantum/Qbit';
import User from '../User';
import AliceController from './AliceController';
import IHumanPlayer from './IHumanPlayer';

export default class HumanAliceController
    extends AliceController
    implements IHumanPlayer
{
    private _user: User;

    constructor(user: User) {
        super();
        this._user = user;
    }

    get socket() {
        if (this._user.socketId) {
            return IO.getInstance().server.to(this._user.socketId);
        } else {
            throw new Error('SocketID on alice user is not defined.');
        }
    }

    get userId() {
        return this._user.id;
    }

    startGame(game: Game): void {
        this.socket.emit('startedGame', game.toJson());
    }

    sendQbit(qbit: Qbit): void {
        this.controlledPlayer.sendQbit(qbit);
    }
}

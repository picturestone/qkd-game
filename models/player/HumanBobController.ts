import Randomizer from '../../helper/Randomizer';
import IO from '../../sockets/IO';
import Game from '../Game';
import Basis from '../quantum/Basis';
import Qbit from '../quantum/Qbit';
import User from '../User';
import BobController from './BobController';
import IHumanPlayer from './IHumanPlayer';

export default class HumanBobController
    extends BobController
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
            throw new Error('SocketID on bob user is not defined.');
        }
    }

    startGame(game: Game): void {
        this.socket.emit('startedGame', game.toJson());
    }

    receiveQbit(qbit: Qbit): void {
        // TODO implement correctls.
        const measuredPolarization = qbit.measurePolarization(
            Randomizer.getRandomEnum(Basis)
        );
        console.log(measuredPolarization);
    }
}

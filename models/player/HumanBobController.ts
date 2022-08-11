import IO from '../../sockets/IO';
import Game from '../Game';
import Basis from '../../qkd-game-client/src/models/api/Basis';
import BobController from './BobController';
import IHumanPlayer from './IHumanPlayer';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import IUser = Express.User;

export default class HumanBobController
    extends BobController
    implements IHumanPlayer
{
    private _user: IUser;

    constructor(user: IUser) {
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

    get userId() {
        return this._user.id;
    }

    startGame(game: Game): void {
        this.socket.emit('startedGame', game.toJson());
    }

    measureEnqueuedQbit(basis: Basis): POLARIZATION | undefined {
        const qbit = this.controlledPlayer.dequeueQbit();
        let measuredPolarization: POLARIZATION | undefined = undefined;
        if (qbit) {
            measuredPolarization = qbit.measurePolarization(basis);
        }
        return measuredPolarization;
    }

    onQbitEnqueue(): void {
        this.socket.emit('qbitEnqueued');
    }

    onBasisComparisonEnqueue(): void {
        const basisComparison = this.controlledPlayer.dequeueBasisComparison();
        if (basisComparison) {
            this.socket.emit('basisPublished', basisComparison);
        }
    }
}

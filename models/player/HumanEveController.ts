import Basis from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import IO from '../../sockets/IO';
import Game from '../Game';
import Qbit from '../quantum/Qbit';
import User from '../User';
import EveController from './EveController';
import IHumanPlayer from './IHumanPlayer';

export default class HumanEveController
    extends EveController
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
            throw new Error('SocketID on eve user is not defined.');
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

    onQbitDiscardEnqueue(): void {
        const qbitDiscard = this.controlledPlayer.dequeueQbitDiscard();
        if (qbitDiscard) {
            this.socket.emit('discardPublished', qbitDiscard);
        }
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

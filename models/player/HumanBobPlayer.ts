import Game from '../Game';
import Basis from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import IUser = Express.User;
import BobPlayer from './BobPlayer';
import QuantumChannel from '../channel/QuantumChannel';
import BasisComparisonChannel from '../channel/BasisComparisonChannel';
import IQbitDiscardData from '../../qkd-game-client/src/models/api/IQbitDiscardedData';
import ISink from '../channel/ISink';
import HumanPlayer from './HumanPlayer';

export default class HumanBobPlayer extends BobPlayer {
    private _humanPlayer: HumanPlayer;

    constructor(
        quantumChannel: QuantumChannel,
        basisComparisonChannel: BasisComparisonChannel,
        qbitDiscardChannel: ISink<IQbitDiscardData>,
        user: IUser
    ) {
        super(quantumChannel, basisComparisonChannel, qbitDiscardChannel);
        this._humanPlayer = new HumanPlayer(user);
    }

    get humanPlayer(): HumanPlayer | undefined {
        return this._humanPlayer;
    }

    startGame(game: Game): void {
        this._humanPlayer.socket.emit('startedGame', game.toJson());
    }

    measureEnqueuedQbit(basis: Basis): POLARIZATION | undefined {
        const qbit = this.dequeueQbit();
        let measuredPolarization: POLARIZATION | undefined = undefined;
        if (qbit) {
            measuredPolarization = qbit.measurePolarization(basis);
        }
        return measuredPolarization;
    }

    onQbitEnqueue(): void {
        this._humanPlayer.socket.emit('qbitEnqueued');
    }

    onBasisComparisonEnqueue(): void {
        const basisComparison = this.dequeueBasisComparison();
        if (basisComparison) {
            this._humanPlayer.socket.emit('basisPublished', basisComparison);
        }
    }

    onCodesPublished(aliceCode: string, bobCode: string): void {
        this._humanPlayer.socket.emit('allCodesPublished', {
            aliceCode: aliceCode,
            bobCode: bobCode,
        });
    }
}

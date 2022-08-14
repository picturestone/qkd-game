import Basis from '../../qkd-game-client/src/models/api/Basis';
import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';
import IQbitDiscardData from '../../qkd-game-client/src/models/api/IQbitDiscardedData';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import BasisComparisonChannel from '../channel/BasisComparisonChannel';
import ISink from '../channel/ISink';
import QbitDiscardChannel from '../channel/QbitDiscardChannel';
import QuantumChannel from '../channel/QuantumChannel';
import Game from '../Game';
import Qbit from '../quantum/Qbit';
import EvePlayer from './EvePlayer';
import HumanPlayer from './HumanPlayer';
import IUser = Express.User;

export default class HumanEvePlayer extends EvePlayer {
    private _humanPlayer: HumanPlayer;

    constructor(
        sourceQuantumChannel: QuantumChannel,
        sinkQuantumChannel: ISink<Qbit>,
        sourceBasisComparisonChannel: BasisComparisonChannel,
        sinkBasisComparisonChannel: ISink<IBasisComparisonData>,
        sourceQbitDiscardChannel: QbitDiscardChannel,
        sinkQbitDiscardChannel: ISink<IQbitDiscardData>,
        user: IUser
    ) {
        super(
            sourceQuantumChannel,
            sinkQuantumChannel,
            sourceBasisComparisonChannel,
            sinkBasisComparisonChannel,
            sourceQbitDiscardChannel,
            sinkQbitDiscardChannel
        );
        this._humanPlayer = new HumanPlayer(user);
    }

    get humanPlayer(): HumanPlayer | undefined {
        return this._humanPlayer;
    }

    startGame(): void {
        this._humanPlayer.startGame(this.game);
    }

    public onOtherPlayerLeftGame(game: Game): void {
        this._humanPlayer.playerLeftGame(game);
    }

    onAllPlayersDoneWithGame(
        aliceCode: string,
        bobCode: string,
        isAliceThinkingEveListenedIn: boolean,
        isBobThinkingEveListenedIn: boolean,
        eveCode?: string
    ): void {
        this._humanPlayer.allPlayersDoneWithGame(
            aliceCode,
            bobCode,
            isAliceThinkingEveListenedIn,
            isBobThinkingEveListenedIn,
            eveCode
        );
    }

    onQbitDiscardEnqueue(): void {
        const qbitDiscard = this.dequeueQbitDiscard();
        if (qbitDiscard) {
            this._humanPlayer.socket.emit('discardPublished', qbitDiscard);
        }
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
}

import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';
import ISink from '../channel/ISink';
import QbitDiscardChannel from '../channel/QbitDiscardChannel';
import Game from '../Game';
import Qbit from '../quantum/Qbit';
import AlicePlayer from './AlicePlayer';
import HumanPlayer from './HumanPlayer';
import IUser = Express.User;

export default class HumanAlicePlayer extends AlicePlayer {
    private _humanPlayer: HumanPlayer;

    constructor(
        quantumChannel: ISink<Qbit>,
        basisComparisonChannel: ISink<IBasisComparisonData>,
        qbitDiscardChannel: QbitDiscardChannel,
        user: IUser
    ) {
        super(quantumChannel, basisComparisonChannel, qbitDiscardChannel);
        this._humanPlayer = new HumanPlayer(user);
    }

    get humanPlayer(): HumanPlayer | undefined {
        return this._humanPlayer;
    }

    startGame(): void {
        this._humanPlayer.startGame(this.game);
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

    onAllCodesPublished(aliceCode: string, bobCode: string): void {
        this._humanPlayer.socket.emit('allCodesPublished', {
            aliceCode: aliceCode,
            bobCode: bobCode,
        });
    }
}

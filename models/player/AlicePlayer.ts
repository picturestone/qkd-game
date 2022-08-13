import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';
import ISink from '../channel/ISink';
import QbitDiscardChannel from '../channel/QbitDiscardChannel';
import IQbitDiscardChannelObserver from '../channel/IQbitDiscardChannelObserver';
import Qbit from '../quantum/Qbit';
import Player from './Player';

export default abstract class AlicePlayer
    extends Player
    implements IQbitDiscardChannelObserver
{
    // TODO rename these to source and sink channels, like with eve player.
    private _quantumChannel: ISink<Qbit>;
    private _basisComparisonChannel: ISink<IBasisComparisonData>;
    private _qbitDiscardChannel: QbitDiscardChannel;
    private _isThinkingEveListenedIn?: boolean;

    constructor(
        quantumChannel: ISink<Qbit>,
        basisComparisonChannel: ISink<IBasisComparisonData>,
        qbitDiscardChannel: QbitDiscardChannel
    ) {
        super();
        this._quantumChannel = quantumChannel;
        this._basisComparisonChannel = basisComparisonChannel;
        this._qbitDiscardChannel = qbitDiscardChannel;
        this._qbitDiscardChannel.addObserver(this);
    }

    abstract onQbitDiscardEnqueue(): void;
    abstract onAllCodesPublished(aliceCode: string, bobCode: string): void;

    public onCodePublished(): void {
        this.game?.onCodePublished();
    }

    get isThinkingEveListenedIn() {
        return this._isThinkingEveListenedIn;
    }

    set isThinkingEveListenedIn(value: boolean | undefined) {
        this._isThinkingEveListenedIn = value;
        if (value !== undefined) {
            this.isDoneWithGame = true;
        }
    }

    public sendQbit(qbit: Qbit) {
        this._quantumChannel.enqueue(qbit);
    }

    public sendBasisComparison(basisComparison: IBasisComparisonData) {
        this._basisComparisonChannel.enqueue(basisComparison);
    }

    public dequeueQbitDiscard() {
        return this._qbitDiscardChannel.dequeue();
    }
}

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
    private _isEveIsListeningInGuess?: boolean;

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
    abstract onCodesPublished(aliceCode: string, bobCode: string): void;

    get isEveListeningInGuess() {
        return this._isEveIsListeningInGuess;
    }

    set isEveListeningInGuess(value: boolean | undefined) {
        this._isEveIsListeningInGuess = value;
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

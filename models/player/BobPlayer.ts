import Player from './Player';
import ISink from '../channel/ISink';
import IQbitDiscardData from '../../qkd-game-client/src/models/api/IQbitDiscardedData';
import IQuantumChannelObserver from '../channel/IQuantumChannelObserver';
import QuantumChannel from '../channel/QuantumChannel';
import IBasisComparisonChannelObserver from '../channel/IBasisComparisonChannelObserver';
import BasisComparisonChannel from '../channel/BasisComparisonChannel';
import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';

export default abstract class BobPlayer
    extends Player
    implements IQuantumChannelObserver, IBasisComparisonChannelObserver
{
    // TODO rename these to source and sink channels, like with eve player.
    private _quantumChannel: QuantumChannel;
    private _basisComparisonChannel: BasisComparisonChannel;
    private _qbitDiscardChannel: ISink<IQbitDiscardData>;
    private _isThinkingEveListenedIn?: boolean;

    constructor(
        quantumChannel: QuantumChannel,
        basisComparisonChannel: BasisComparisonChannel,
        qbitDiscardChannel: ISink<IQbitDiscardData>
    ) {
        super();
        this._quantumChannel = quantumChannel;
        this._quantumChannel.addObserver(this);
        this._basisComparisonChannel = basisComparisonChannel;
        this._basisComparisonChannel.addObserver(this);
        this._qbitDiscardChannel = qbitDiscardChannel;
    }

    abstract onQbitEnqueue(): void;
    abstract onBasisComparisonEnqueue(): void;
    abstract measureEnqueuedQbit(basis: BASIS): POLARIZATION | undefined;
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

    public dequeueQbit() {
        return this._quantumChannel.dequeue();
    }

    public dequeueBasisComparison() {
        return this._basisComparisonChannel.dequeue();
    }

    public sendQbitDiscard(qbitDiscard: IQbitDiscardData) {
        this._qbitDiscardChannel.enqueue(qbitDiscard);
    }
}

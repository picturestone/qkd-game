import BASIS from '../../qkd-game-client/src/models/api/Basis';
import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';
import IQbitDiscardData from '../../qkd-game-client/src/models/api/IQbitDiscardedData';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import BasisComparisonChannel from '../channel/BasisComparisonChannel';
import IBasisComparisonChannelObserver from '../channel/IBasisComparisonChannelObserver';
import IQbitDiscardChannelObserver from '../channel/IQbitDiscardChannelObserver';
import IQuantumChannelObserver from '../channel/IQuantumChannelObserver';
import ISink from '../channel/ISink';
import QbitDiscardChannel from '../channel/QbitDiscardChannel';
import QuantumChannel from '../channel/QuantumChannel';
import Qbit from '../quantum/Qbit';
import Player from './Player';

export default abstract class EvePlayer
    extends Player
    implements
        IQuantumChannelObserver,
        IBasisComparisonChannelObserver,
        IQbitDiscardChannelObserver
{
    private _sourceQuantumChannel: QuantumChannel;
    private _sinkQuantumChannel: ISink<Qbit>;
    private _sourceBasisComparisonChannel: BasisComparisonChannel;
    private _sinkBasisComparisonChannel: ISink<IBasisComparisonData>;
    private _sinkQbitDiscardChannel: ISink<IQbitDiscardData>;
    private _sourceQbitDiscardChannel: QbitDiscardChannel;

    constructor(
        sourceQuantumChannel: QuantumChannel,
        sinkQuantumChannel: ISink<Qbit>,
        sourceBasisComparisonChannel: BasisComparisonChannel,
        sinkBasisComparisonChannel: ISink<IBasisComparisonData>,
        sourceQbitDiscardChannel: QbitDiscardChannel,
        sinkQbitDiscardChannel: ISink<IQbitDiscardData>
    ) {
        super();
        this._sourceQuantumChannel = sourceQuantumChannel;
        this._sourceQuantumChannel.addObserver(this);
        this._sinkQuantumChannel = sinkQuantumChannel;
        this._sourceBasisComparisonChannel = sourceBasisComparisonChannel;
        this._sourceBasisComparisonChannel.addObserver(this);
        this._sinkBasisComparisonChannel = sinkBasisComparisonChannel;
        this._sourceQbitDiscardChannel = sourceQbitDiscardChannel;
        this._sourceQbitDiscardChannel.addObserver(this);
        this._sinkQbitDiscardChannel = sinkQbitDiscardChannel;
    }

    abstract onQbitDiscardEnqueue(): void;
    abstract onQbitEnqueue(): void;
    abstract onBasisComparisonEnqueue(): void;
    abstract measureEnqueuedQbit(basis: BASIS): POLARIZATION | undefined;

    public sendQbit(qbit: Qbit) {
        this._sinkQuantumChannel.enqueue(qbit);
    }

    public sendBasisComparison(basisComparison: IBasisComparisonData) {
        this._sinkBasisComparisonChannel.enqueue(basisComparison);
    }

    public dequeueQbitDiscard() {
        return this._sourceQbitDiscardChannel.dequeue();
    }

    public dequeueQbit() {
        return this._sourceQuantumChannel.dequeue();
    }

    public dequeueBasisComparison() {
        return this._sourceBasisComparisonChannel.dequeue();
    }

    public sendQbitDiscard(qbitDiscard: IQbitDiscardData) {
        this._sinkQbitDiscardChannel.enqueue(qbitDiscard);
    }
}

import ISource from '../channel/ISource';
import Qbit from '../quantum/Qbit';
import BobController from './BobController';
import Player from './Player';
import ISink from '../channel/ISink';
import IQbitDiscardData from '../../qkd-game-client/src/models/api/IQbitDiscardedData';
import IQuantumChannelObserver from '../channel/IQuantumChannelObserver';
import QuantumChannel from '../channel/QuantumChannel';
import IBasisComparisonChannelObserver from '../channel/IBasisComparisonChannelObserver';
import BasisComparisonChannel from '../channel/BasisComparisonChannel';

export default class BobPlayer
    extends Player
    implements IQuantumChannelObserver, IBasisComparisonChannelObserver
{
    // TODO rename these to source and sink channels, like with eve player.
    private _quantumChannel: QuantumChannel;
    private _basisComparisonChannel: BasisComparisonChannel;
    private _qbitDiscardChannel: ISink<IQbitDiscardData>;
    private _controller: BobController;

    constructor(
        controller: BobController,
        quantumChannel: QuantumChannel,
        basisComparisonChannel: BasisComparisonChannel,
        qbitDiscardChannel: ISink<IQbitDiscardData>
    ) {
        super(controller);
        this._controller = controller;
        this._quantumChannel = quantumChannel;
        this._quantumChannel.addObserver(this);
        this._basisComparisonChannel = basisComparisonChannel;
        this._basisComparisonChannel.addObserver(this);
        this._qbitDiscardChannel = qbitDiscardChannel;
    }

    get controller(): BobController {
        return this._controller;
    }

    public onBasisComparisonEnqueue(): void {
        this._controller.onBasisComparisonEnqueue();
    }

    public onQbitEnqueue(): void {
        this._controller.onQbitEnqueue();
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

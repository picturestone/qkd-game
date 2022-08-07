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

    onBasisComparisonEnqueue(): void {
        this._controller.onBasisComparisonEnqueue();
    }

    onQbitEnqueue(): void {
        this._controller.onQbitEnqueue();
    }

    get controller(): BobController {
        return this._controller;
    }

    dequeueQbit() {
        return this._quantumChannel.dequeue();
    }

    dequeueBasisComparison() {
        return this._basisComparisonChannel.dequeue();
    }

    public sendQbitDiscard(qbitDiscard: IQbitDiscardData) {
        this._qbitDiscardChannel.enqueue(qbitDiscard);
    }
}

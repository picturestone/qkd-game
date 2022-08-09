import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';
import ISink from '../channel/ISink';
import QbitDiscardChannel from '../channel/QbitDiscardChannel';
import IQbitDiscardChannelObserver from '../channel/IQbitDiscardChannelObserver';
import Qbit from '../quantum/Qbit';
import AliceController from './AliceController';
import Player from './Player';

export default class AlicePlayer
    extends Player
    implements IQbitDiscardChannelObserver
{
    // TODO rename these to source and sink channels, like with eve player.
    private _quantumChannel: ISink<Qbit>;
    private _basisComparisonChannel: ISink<IBasisComparisonData>;
    private _qbitDiscardChannel: QbitDiscardChannel;
    private _controller: AliceController;

    constructor(
        controller: AliceController,
        quantumChannel: ISink<Qbit>,
        basisComparisonChannel: ISink<IBasisComparisonData>,
        qbitDiscardChannel: QbitDiscardChannel
    ) {
        super(controller);
        this._controller = controller;
        this._quantumChannel = quantumChannel;
        this._basisComparisonChannel = basisComparisonChannel;
        this._qbitDiscardChannel = qbitDiscardChannel;
        this._qbitDiscardChannel.addObserver(this);
    }

    get controller(): AliceController {
        return this._controller;
    }

    public onQbitDiscardEnqueue(): void {
        this._controller.onQbitDiscardEnqueue();
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

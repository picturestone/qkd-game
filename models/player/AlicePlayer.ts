import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';
import IQbitDiscardData from '../../qkd-game-client/src/models/api/IQbitDiscardedData';
import ISink from '../channel/ISink';
import ISource from '../channel/ISource';
import QbitDiscardChannel from '../channel/QbitDiscardChannel';
import IQbitDiscardChannelObserver from '../channel/IQbitDiscardChannelObserver';
import Qbit from '../quantum/Qbit';
import AliceController from './AliceController';
import Player from './Player';

export default class AlicePlayer
    extends Player
    implements IQbitDiscardChannelObserver
{
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

    onQbitDiscardEnqueue(): void {
        this._controller.onQbitDiscardEnqueue();
    }

    get controller(): AliceController {
        return this._controller;
    }

    public sendQbit(qbit: Qbit) {
        this._quantumChannel.enqueue(qbit);
    }

    public sendBasisComparison(basisComparison: IBasisComparisonData) {
        this._basisComparisonChannel.enqueue(basisComparison);
    }

    dequeueQbitDiscard() {
        return this._qbitDiscardChannel.dequeue();
    }
}

import ISink from '../channel/ISink';
import Qbit from '../quantum/Qbit';
import AliceController from './AliceController';
import Player from './Player';

export default class AlicePlayer extends Player {
    private _quantumChannel: ISink<Qbit>;
    // TODO add classical channel: ISource<confirmation> or something.
    private _controller: AliceController;

    constructor(controller: AliceController, quantumChannel: ISink<Qbit>) {
        super(controller);
        this._controller = controller;
        this._quantumChannel = quantumChannel;
    }

    get controller(): AliceController {
        return this._controller;
    }

    public sendQbit(qbit: Qbit) {
        this._quantumChannel.enqueue(qbit);
    }
}

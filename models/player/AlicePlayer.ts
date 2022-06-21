import ISink from '../channel/ISink';
import Qbit from '../quantum/Qbit';
import AliceController from './AliceController';
import Player from './Player';

export default class AlicePlayer extends Player {
    private _quantumChannel: ISink<Qbit>;
    // TODO add classical channel: ISource<confirmation> or something.

    constructor(controller: AliceController, quantumChannel: ISink<Qbit>) {
        super(controller);
        this._quantumChannel = quantumChannel;
    }

    public sendQbit(qbit: Qbit) {
        this._quantumChannel.enqueue(qbit);
    }
}

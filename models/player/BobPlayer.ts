import IChannelObserver from '../channel/ISourceObserver';
import ISource from '../channel/ISource';
import Qbit from '../quantum/Qbit';
import BobController from './BobController';
import Player from './Player';

export default class BobPlayer
    extends Player
    implements IChannelObserver<Qbit>
{
    // Is the source even necessary?
    private _quantumChannel: ISource<Qbit>;
    // TODO add classical channel: ISink<confirmation> or something.
    private _controller: BobController;

    constructor(controller: BobController, quantumChannel: ISource<Qbit>) {
        super(controller);
        this._controller = controller;
        this._quantumChannel = quantumChannel;
        this._quantumChannel.addObserver(this);
    }

    get controller(): BobController {
        return this._controller;
    }

    // Called when qbit is added to quantum channel.
    onEnqueue(): void {
        this._controller.onEnqueue();
    }

    dequeueQbit() {
        return this._quantumChannel.dequeue();
    }
}

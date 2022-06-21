import Randomizer from '../../helper/Randomizer';
import IChannelObserver from '../channel/ISourceObserver';
import ISource from '../channel/ISource';
import Basis from '../quantum/Basis';
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

    constructor(controller: BobController, quantumChannel: ISource<Qbit>) {
        super(controller);
        this._quantumChannel = quantumChannel;
        this._quantumChannel.addObserver(this);
    }

    // Called when qbit is added to quantum channel.
    // TODO this function must be given to the role in the constructor because from here on the player cannot be notified
    onEnqueue(to: ISource<Qbit>): void {
        const qbit = to.dequeue();
        const measuredPolarization = qbit?.measurePolarization(
            Randomizer.getRandomEnum(Basis)
        );
        console.log(measuredPolarization);
    }
}
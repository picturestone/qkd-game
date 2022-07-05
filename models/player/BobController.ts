import Qbit from '../quantum/Qbit';
import BobPlayer from './BobPlayer';
import PlayerController from './PlayerController';
import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';

export default abstract class BobController extends PlayerController<BobPlayer> {
    abstract onEnqueue(): void;
    abstract measureEnqueuedQbit(basis: BASIS): POLARIZATION | undefined;
}

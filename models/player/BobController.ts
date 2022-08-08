import Qbit from '../quantum/Qbit';
import BobPlayer from './BobPlayer';
import PlayerController from './PlayerController';
import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';

export default abstract class BobController extends PlayerController<BobPlayer> {
    abstract onQbitEnqueue(): void;
    abstract onBasisComparisonEnqueue(): void;
    abstract measureEnqueuedQbit(basis: BASIS): POLARIZATION | undefined;
}

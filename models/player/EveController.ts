import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import Qbit from '../quantum/Qbit';
import EvePlayer from './EvePlayer';
import PlayerController from './PlayerController';

export default abstract class EveController extends PlayerController<EvePlayer> {
    abstract sendQbit(qbit: Qbit): void;
    abstract onQbitDiscardEnqueue(): void;
    abstract onQbitEnqueue(): void;
    abstract onBasisComparisonEnqueue(): void;
    abstract measureEnqueuedQbit(basis: BASIS): POLARIZATION | undefined;
}

import BobPlayer from './BobPlayer';
import PlayerController from './PlayerController';
import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';

export default abstract class BobController extends PlayerController<BobPlayer> {
    abstract onQbitEnqueue(): void;
    abstract onBasisComparisonEnqueue(): void;
    abstract measureEnqueuedQbit(basis: BASIS): POLARIZATION | undefined;
    abstract onCodesPublished(aliceCode: string, bobCode: string): void;
}

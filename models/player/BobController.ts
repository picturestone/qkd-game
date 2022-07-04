import Qbit from '../quantum/Qbit';
import BobPlayer from './BobPlayer';
import PlayerController from './PlayerController';

export default abstract class BobController extends PlayerController<BobPlayer> {
    abstract receiveQbit(qbit: Qbit): void;
}

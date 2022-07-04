import Qbit from '../quantum/Qbit';
import EvePlayer from './EvePlayer';
import PlayerController from './PlayerController';

export default abstract class EveController extends PlayerController<EvePlayer> {
    abstract sendQbit(qbit: Qbit): void;
    abstract receiveQbit(qbit: Qbit): void;
}

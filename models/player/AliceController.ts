import Qbit from '../quantum/Qbit';
import AlicePlayer from './AlicePlayer';
import PlayerController from './PlayerController';

export default abstract class AliceController extends PlayerController<AlicePlayer> {
    abstract sendQbit(qbit: Qbit): void;
}

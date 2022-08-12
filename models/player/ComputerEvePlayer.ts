import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import Game from '../Game';
import EvePlayer from './EvePlayer';
import HumanPlayer from './HumanPlayer';

// TODO Implement ComputerEvePlayer.
export default class ComputerEvePlayer extends EvePlayer {
    get humanPlayer(): HumanPlayer | undefined {
        return undefined;
    }

    onQbitDiscardEnqueue(): void {
        throw new Error('Method not implemented.');
    }
    onQbitEnqueue(): void {
        throw new Error('Method not implemented.');
    }
    onBasisComparisonEnqueue(): void {
        throw new Error('Method not implemented.');
    }
    measureEnqueuedQbit(basis: BASIS): POLARIZATION | undefined {
        throw new Error('Method not implemented.');
    }
    startGame(game: Game): void {
        throw new Error('Method not implemented.');
    }
}

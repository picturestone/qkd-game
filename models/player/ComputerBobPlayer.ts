import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import Game from '../Game';
import BobPlayer from './BobPlayer';
import HumanPlayer from './HumanPlayer';

// TODO Implement ComputerBobPlayer.
export default class ComputerBobPlayer extends BobPlayer {
    get humanPlayer(): HumanPlayer | undefined {
        return undefined;
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
    onCodesPublished(aliceCode: string, bobCode: string): void {
        throw new Error('Method not implemented.');
    }
    startGame(game: Game): void {
        throw new Error('Method not implemented.');
    }
}

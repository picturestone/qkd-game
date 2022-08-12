import Game from '../Game';
import AlicePlayer from './AlicePlayer';
import HumanPlayer from './HumanPlayer';

// TODO Implement ComputerAlicePlayer.
export default class ComputerAlicePlayer extends AlicePlayer {
    get humanPlayer(): HumanPlayer | undefined {
        return undefined;
    }

    onQbitDiscardEnqueue(): void {
        throw new Error('Method not implemented.');
    }
    onCodesPublished(aliceCode: string, bobCode: string): void {
        throw new Error('Method not implemented.');
    }
    startGame(game: Game): void {
        throw new Error('Method not implemented.');
    }
}

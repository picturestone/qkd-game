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
    onAllCodesPublished(aliceCode: string, bobCode: string): void {
        throw new Error('Method not implemented.');
    }
    startGame(): void {
        throw new Error('Method not implemented.');
    }
    onAllPlayersDoneWithGame(
        aliceCode: string,
        bobCode: string,
        isAliceThinkingEveListenedIn: boolean,
        isBobThinkingEveListenedIn: boolean,
        eveCode?: string
    ): void {
        throw new Error('Method not implemented.');
    }
}

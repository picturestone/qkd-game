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

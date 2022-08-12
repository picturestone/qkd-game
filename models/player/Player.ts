import Game from '../Game';
import HumanPlayer from './HumanPlayer';

export default abstract class Player {
    private _publishedCode?: string;
    private _isDoneWithGame: boolean;
    private _game?: Game;

    constructor() {
        this._isDoneWithGame = false;
    }

    abstract get humanPlayer(): HumanPlayer | undefined;
    abstract startGame(): void;
    abstract onAllPlayersDoneWithGame(
        aliceCode: string,
        bobCode: string,
        isAliceThinkingEveListenedIn: boolean,
        isBobThinkingEveListenedIn: boolean,
        eveCode?: string
    ): void;

    get game() {
        return this._game;
    }

    set game(value: Game | undefined) {
        this._game = value;
    }

    get publishedCode() {
        return this._publishedCode;
    }

    set publishedCode(value: string | undefined) {
        this._publishedCode = value;
        this.onCodePublished();
    }

    public abstract onCodePublished(): void;

    get isDoneWithGame() {
        return this._isDoneWithGame;
    }

    set isDoneWithGame(value: boolean) {
        this._isDoneWithGame = value;
        if (this._isDoneWithGame) {
            this._game?.onPlayerDoneWithGame();
        }
    }
}

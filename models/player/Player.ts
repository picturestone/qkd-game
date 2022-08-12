import Game from '../Game';
import HumanPlayer from './HumanPlayer';

export default abstract class Player {
    private _publishedCode?: string;
    private _isDoneWithGame: boolean;

    constructor() {
        this._isDoneWithGame = false;
    }

    abstract get humanPlayer(): HumanPlayer | undefined;

    abstract startGame(game: Game): void;

    get publishedCode() {
        return this._publishedCode;
    }

    set publishedCode(value: string | undefined) {
        this._publishedCode = value;
    }

    get isDoneWithGame() {
        return this._isDoneWithGame;
    }

    set isDoneWithGame(value: boolean) {
        this._isDoneWithGame = value;
    }
}

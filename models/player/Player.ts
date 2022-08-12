import PlayerController from './PlayerController';

export default abstract class Player {
    private _publishedCode?: string;
    private _isDoneWithGame: boolean;

    constructor(controller: PlayerController<Player>) {
        controller.controlledPlayer = this;
        this._isDoneWithGame = false;
    }

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

import PlayerController from './PlayerController';

export default abstract class Player {
    private _publishedCode?: string;

    constructor(controller: PlayerController<Player>) {
        controller.controlledPlayer = this;
    }

    get publishedCode() {
        return this._publishedCode;
    }

    set publishedCode(value: string | undefined) {
        this._publishedCode = value;
    }
}

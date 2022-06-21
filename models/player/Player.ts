import PlayerController from './PlayerController';

export default abstract class Player {
    private _controller: PlayerController<Player>;

    constructor(controller: PlayerController<Player>) {
        this._controller = controller;
        controller.controlledPlayer = this;
    }

    get controller() {
        return this._controller;
    }
}

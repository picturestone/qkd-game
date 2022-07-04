import PlayerController from './PlayerController';

export default abstract class Player {
    constructor(controller: PlayerController<Player>) {
        controller.controlledPlayer = this;
    }
}

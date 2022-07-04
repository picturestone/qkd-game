import Game from '../Game';
import Player from './Player';

export default abstract class PlayerController<PlayerType extends Player> {
    private _controlledPlayer?: PlayerType;

    set controlledPlayer(controlledPlayer: PlayerType) {
        this._controlledPlayer = controlledPlayer;
    }

    get controlledPlayer() {
        if (this._controlledPlayer) {
            return this._controlledPlayer;
        } else {
            throw new Error('ControlledPlayer must be set');
        }
    }

    get userId(): string | undefined {
        return undefined;
    }

    abstract startGame(game: Game): void;
}

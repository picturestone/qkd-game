import { v4 as uuidv4 } from 'uuid';
import Game from '../models/Game';

export default class GameDb {
    // TODO use database instead of in-memory
    static _games = new Array<Game>();

    create(game: Game) {
        return new Promise<Game>((res) => {
            game.id = uuidv4();
            GameDb._games.push(game);
            res(game);
        });
    }

    findById(id: string) {
        return new Promise<Game | undefined>((res) => {
            const game = GameDb._games.find((game) => game.id === id);
            res(game);
        });
    }
}

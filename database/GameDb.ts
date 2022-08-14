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

    delete(id: string) {
        return new Promise<Game | undefined>((res) => {
            const index = GameDb._games.findIndex((game) => game.id === id);
            const removedGames = GameDb._games.splice(index, 1);
            let retVal: Game | undefined = undefined;
            if (removedGames.length > 0) {
                retVal = removedGames[0];
            }
            res(retVal);
        });
    }
}

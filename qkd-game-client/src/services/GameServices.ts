import Game from '../models/Game';
import apiService from './ApiService';

export default class GameService {
    private _resUrl = '/games';

    public get(id: string): Promise<Game> {
        return apiService.get(`${this._resUrl}/${id}`).then((res) => {
            return Game.fromJson(res.data);
        });
    }
}

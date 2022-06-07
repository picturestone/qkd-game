import ILobbyJson from '../models/api/ILobbyJson';
import Lobby from '../models/Lobby';
import apiService from './ApiService';

export default class LobbyService {
    private _resUrl = '/lobbies';

    public getAll(): Promise<Lobby[]> {
        return apiService.get(this._resUrl).then((res) => {
            const lobbies = new Array<Lobby>();
            res.data.forEach((json: ILobbyJson) => {
                lobbies.push(this.jsonToModel(json));
            });

            return lobbies;
        });
    }

    public get(id: string): Promise<Lobby> {
        return apiService.get(`${this._resUrl}/${id}`).then((res) => {
            return this.jsonToModel(res.data);
        });
    }

    public create(lobby: Lobby): Promise<Lobby> {
        return apiService
            .post(this._resUrl, this.modelToJson(lobby))
            .then((res) => {
                return this.jsonToModel(res.data);
            });
    }

    private jsonToModel(json: ILobbyJson): Lobby {
        return new Lobby(json.name);
    }

    private modelToJson(model: Lobby): ILobbyJson {
        return {
            name: model.name,
        };
    }
}

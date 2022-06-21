import ILobbyJson from '../models/api/ILobbyJson';
import Lobby from '../models/Lobby';
import apiService from './ApiService';

export default class LobbyService {
    private _resUrl = '/lobbies';

    public getAll(): Promise<Lobby[]> {
        return apiService.get(this._resUrl).then((res) => {
            const lobbies = new Array<Lobby>();
            res.data.forEach((json: ILobbyJson) => {
                lobbies.push(Lobby.fromJson(json));
            });

            return lobbies;
        });
    }

    public get(id: string): Promise<Lobby> {
        return apiService.get(`${this._resUrl}/${id}`).then((res) => {
            return Lobby.fromJson(res.data);
        });
    }

    public create(lobby: Lobby): Promise<Lobby> {
        return apiService.post(this._resUrl, lobby.toJson()).then((res) => {
            return Lobby.fromJson(res.data);
        });
    }

    public startGame(lobby: Lobby): Promise<void> {
        return apiService
            .post(`${this._resUrl}/${lobby.id}/start`)
            .then((res) => {
                return;
            });
    }
}

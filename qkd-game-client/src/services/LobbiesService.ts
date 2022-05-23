import ILobbyJson from '../models/api/ILobbyJson';
import Lobby from '../models/Lobby'

export default class LobbiesService {
    private _baseUrl = '/api/lobbies';

    public getAll(): Promise<Lobby[]> {
        return fetch(this._baseUrl)
            .then(data => {
                return data.json();
            }).then((data) => {
                const lobbies = new Array<Lobby>();
                data.forEach((json: ILobbyJson) => {
                    lobbies.push(this.jsonToModel(json));
                });

                return lobbies;
            }
        );
    }

    public get(id: string): Promise<Lobby> {
        return fetch(`${this._baseUrl}/${id}`)
            .then(data => {
                return data.json();
            }).then((data) => {
                return this.jsonToModel(data);
            }
        );
    }

    public create(lobby: Lobby): Promise<Lobby> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.modelToJson(lobby))
        };
        return fetch(this._baseUrl, requestOptions)
            .then(data => {
                return data.json();
            }).then((data) => {
                return this.jsonToModel(data);
            }
        );
    }

    private jsonToModel(json: ILobbyJson): Lobby {
        return new Lobby(
            json.name
        );
    }

    private modelToJson(model: Lobby): ILobbyJson {
        return {
            name: model.name
        };
    }
}

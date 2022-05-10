import ILobbyJson from '../models/api/ILobbyJson';
import Lobby from '../models/Lobby'

export default class LobbiesService {
    getAll(): Promise<Lobby[]> {
        return fetch('/api/lobbies')
            .then(data => {
                return data.json();
            }).then((data) => {
                const lobbies = new Array<Lobby>();
                data.forEach((lobbyJson: ILobbyJson) => {
                    lobbies.push(new Lobby(
                        lobbyJson.name
                    ));
                });

                return lobbies;
            }
        );
    }
}

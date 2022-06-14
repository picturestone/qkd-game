import { v4 as uuidv4 } from 'uuid';
import Lobby from '../models/Lobby';

export default class LobbyDb {
    // TODO use database instead of in-memory
    static _lobbies = new Array<Lobby>();

    create(lobby: Lobby) {
        return new Promise<Lobby>((res) => {
            lobby.setId(uuidv4());
            LobbyDb._lobbies.push(lobby);
            res(lobby);
        });
    }

    findById(id: string) {
        return new Promise<Lobby | undefined>((res) => {
            const lobby = LobbyDb._lobbies.find(
                (lobby) => lobby.getId() === id
            );
            res(lobby);
        });
    }

    findAll() {
        return new Promise<Lobby[]>((res) => {
            res(LobbyDb._lobbies);
        });
    }
}

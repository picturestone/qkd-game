import { v4 as uuidv4 } from 'uuid';
import Lobby from '../models/Lobby';

export default class LobbyDb {
    // TODO use database instead of in-memory
    static _lobbies = new Array<Lobby>();

    create(lobby: Lobby) {
        return new Promise<Lobby>((res) => {
            LobbyDb._lobbies.push(lobby);
            res(lobby);
        });
    }

    getAll() {
        return new Promise<Lobby[]>((res) => {
            res(LobbyDb._lobbies);
        });
    }
}

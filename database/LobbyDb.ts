import { v4 as uuidv4 } from 'uuid';
import Lobby from '../models/Lobby';

export default class LobbyDb {
    // TODO use database instead of in-memory
    static _lobbies = new Array<Lobby>();

    create(lobby: Lobby) {
        return new Promise<Lobby>((res) => {
            lobby.id = uuidv4();
            LobbyDb._lobbies.push(lobby);
            res(lobby);
        });
    }

    findById(id: string) {
        return new Promise<Lobby | undefined>((res) => {
            const lobby = LobbyDb._lobbies.find((lobby) => lobby.id === id);
            res(lobby);
        });
    }

    put(updatedLobby: Lobby) {
        return new Promise<Lobby | undefined>((res) => {
            const lobbyIndex = LobbyDb._lobbies.findIndex(
                (lobby) => lobby.id === updatedLobby.id
            );
            if (lobbyIndex === -1) {
                res(undefined);
            } else {
                LobbyDb._lobbies[lobbyIndex] = updatedLobby;
                res(updatedLobby);
            }
        });
    }

    findAll() {
        return new Promise<Lobby[]>((res) => {
            res(LobbyDb._lobbies);
        });
    }
}

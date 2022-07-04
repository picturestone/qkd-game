import { PLAYERROLE } from './PlayerRole';

export default interface IClientToServerEvents {
    hello: () => void;
    joinLobby: (lobbyId: string) => void;
    selectLobbyRole: (lobbyId: string, lobbyRole: PLAYERROLE) => void;
}

import BASIS from './Basis';
import IQbitJson from './IQbitJson';
import { PLAYERROLE } from './PlayerRole';
import POLARIZATION from './Polarization';

export default interface IClientToServerEvents {
    hello: () => void;
    joinLobby: (lobbyId: string) => void;
    selectLobbyRole: (lobbyId: string, lobbyRole: PLAYERROLE) => void;
    sendQbit: (gameId: string, qbit: IQbitJson) => void;
    measureEnqueuedQbit: (
        gameId: string,
        basis: BASIS,
        cb: (polarization: POLARIZATION | undefined) => void
    ) => void;
}

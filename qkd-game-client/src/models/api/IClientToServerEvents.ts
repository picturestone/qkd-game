import BASIS from './Basis';
import IBasisComparisonData from './IBasisComparisonData';
import IQbitDiscardData from './IQbitDiscardedData';
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
    publishBasis: (
        gameId: string,
        basisComparisonData: IBasisComparisonData
    ) => void;
    publishDiscard: (
        gameId: string,
        qbitDiscardedData: IQbitDiscardData
    ) => void;
}

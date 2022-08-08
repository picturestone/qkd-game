import BASIS from './Basis';
import IBasisComparisonData from './IBasisComparisonData';
import IQbitDiscardData from './IQbitDiscardedData';
import IQbitJson from './IQbitJson';
import { PLAYERROLE } from './PlayerRole';
import POLARIZATION from './Polarization';

export default interface IClientToServerEvents {
    hello: () => void;
    joinLobby: (lobbyId: string) => void;
    selectLobbyRole: (
        lobbyId: string,
        lobbyRole: PLAYERROLE | undefined
    ) => void;
    sendQbit: (gameId: string, qbit: IQbitJson) => void;
    measureEnqueuedQbit: (
        gameId: string,
        basis: BASIS,
        cb: (polarization: POLARIZATION | undefined) => void
    ) => void;
    publishBasis: (
        gameId: string,
        basisComparisonData: IBasisComparisonData,
        cb: (basisComparisonData: IBasisComparisonData) => void
    ) => void;
    publishDiscard: (
        gameId: string,
        qbitDiscardedData: IQbitDiscardData,
        cb: (qbitDiscardedData: IQbitDiscardData) => void
    ) => void;
}

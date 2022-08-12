import BASIS from './Basis';
import IBasisComparisonData from './IBasisComparisonData';
import IGameResultsData from './IGameResultsData';
import IPublishedCodesData from './IPublishedCodesData';
import IQbitDiscardData from './IQbitDiscardedData';
import IQbitJson from './IQbitJson';
import { PLAYERROLE } from './PlayerRole';
import POLARIZATION from './Polarization';

export default interface IClientToServerEvents {
    hello: () => void;
    joinLobby: (lobbyId: string) => void;
    startGame: (lobbyId: string) => void;
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
    publishCode: (gameId: string, code: string, cb: () => void) => void;
    getPublishedCodes: (
        gameId: string,
        cb: (publishedCodesData: IPublishedCodesData) => void
    ) => void;
    publishIsEveListeningGuess: (
        gameId: string,
        isEveListening: boolean,
        cb: () => void
    ) => void;
    getPublishedResults: (
        gameId: string,
        cb: (publishedResultsData: IGameResultsData) => void
    ) => void;
}

import BASIS from './Basis';
import IBasisComparisonData from './IBasisComparisonData';
import IGameJson from './IGameJson';
import ILobbyJson from './ILobbyJson';
import IQbitDiscardData from './IQbitDiscardedData';

export default interface IServerToClientEvents {
    chatMessage: (message: string) => void;
    updatedLobby: (lobby: ILobbyJson) => void;
    startedGame: (game: IGameJson) => void;
    qbitEnqueued: () => void;
    basisPublished: (basisComparisonData: IBasisComparisonData) => void;
    discardPublished: (qbitDiscardedData: IQbitDiscardData) => void;
}

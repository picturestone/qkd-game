import IBasisComparisonData from './IBasisComparisonData';
import IGameJson from './IGameJson';
import IGameResultsData from './IGameResultsData';
import ILobbyJson from './ILobbyJson';
import IPublishedCodesData from './IPublishedCodesData';
import IQbitDiscardData from './IQbitDiscardedData';

export default interface IServerToClientEvents {
    chatMessage: (message: string) => void;
    ownerLeftLobby: (lobby: ILobbyJson) => void;
    updatedLobby: (lobby: ILobbyJson) => void;
    startedGame: (game: IGameJson) => void;
    qbitEnqueued: () => void;
    basisPublished: (basisComparisonData: IBasisComparisonData) => void;
    discardPublished: (qbitDiscardedData: IQbitDiscardData) => void;
    allCodesPublished: (codes: IPublishedCodesData) => void;
    allPlayersDoneWithGame: (gameResultsData: IGameResultsData) => void;
}

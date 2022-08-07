import BASIS from './Basis';
import IGameJson from './IGameJson';
import ILobbyJson from './ILobbyJson';

export default interface IServerToClientEvents {
    chatMessage: (message: string) => void;
    updatedLobby: (lobby: ILobbyJson) => void;
    startedGame: (game: IGameJson) => void;
    qbitEnqueued: () => void;
    basisPublished: (qbitNo: number, basis: BASIS) => void;
    discardPublished: (qbitNo: number, isDiscarded: boolean) => void;
}

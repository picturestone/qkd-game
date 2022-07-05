import IGameJson from './IGameJson';
import ILobbyJson from './ILobbyJson';

export default interface IServerToClientEvents {
    chatMessage: (message: string) => void;
    updatedLobby: (lobby: ILobbyJson) => void;
    startedGame: (game: IGameJson) => void;
    qbitEnqueued: () => void;
}

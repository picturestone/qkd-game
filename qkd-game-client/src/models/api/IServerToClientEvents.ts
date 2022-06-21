import ILobbyJson from './ILobbyJson';

export default interface IServerToClientEvents {
    chatMessage: (message: string) => void;
    updatedLobby: (lobby: ILobbyJson) => void;
}

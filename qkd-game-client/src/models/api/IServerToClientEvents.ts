export default interface IServerToClientEvents {
    chatMessage: (message: string) => void;
}

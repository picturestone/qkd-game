export default interface IClientToServerEvents {
    hello: () => void;
    joinRoom: (roomId: string) => void;
}

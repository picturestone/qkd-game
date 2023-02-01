import { BroadcastOperator } from 'socket.io';
import IServerToClientEvents from '../../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../../qkd-game-client/src/models/api/ISocketData';

// TODO remove. Not used anywhere.
export default interface IHumanPlayer {
    get socket(): BroadcastOperator<IServerToClientEvents, ISocketData>;
}

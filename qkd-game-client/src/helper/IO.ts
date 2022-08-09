import { singletonHook } from 'react-singleton-hook';
import { io, Socket } from 'socket.io-client';
import IClientToServerEvents from '../models/api/IClientToServerEvents';
import IServerToClientEvents from '../models/api/IServerToClientEvents';
import AuthStorage from './AuthStorage';

function getSocket() {
    // TODO maybe we need to wait for the socket open event. Dependency in useEffect on socket is probably not enough, since the socket does not change and use effect wont fire again.
    // TODO maybe add a connected listener to socket? what if this is fired before the socket is connected?
    const socket: Socket<IServerToClientEvents, IClientToServerEvents> = io(
        process.env.SOCKETIO_CONNECTION_STRING || 'ws://localhost:3001',
        {
            extraHeaders: {
                authorization: new AuthStorage().getToken() || '',
            },
        }
    );

    return socket;
}

// TODO Singleton hook is not yet using the new render method of react 18.
// See https://github.com/Light-Keeper/react-singleton-hook/issues/479
export const useSocket = singletonHook(undefined, getSocket);

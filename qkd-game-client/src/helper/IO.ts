import { singletonHook } from 'react-singleton-hook';
import { io, Socket } from 'socket.io-client';
import IClientToServerEvents from '../models/api/IClientToServerEvents';
import IServerToClientEvents from '../models/api/IServerToClientEvents';
import AuthStorage from './AuthStorage';

function getSocket() {
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

export const useSocket = singletonHook(undefined, getSocket);

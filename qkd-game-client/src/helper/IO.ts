import { io, Socket } from 'socket.io-client';
import IClientToServerEvents from '../models/api/IClientToServerEvents';
import IServerToClientEvents from '../models/api/IServerToClientEvents';
import AuthStorage from './AuthStorage';

declare global {
    interface Window {
        socketIoInstance: Socket<IServerToClientEvents, IClientToServerEvents>;
    }
}

export function useSocket() {
    // TODO remove connection checks where this socket is used.
    if (!window.socketIoInstance) {
        window.socketIoInstance = io({
            extraHeaders: {
                authorization: new AuthStorage().getToken() || '',
            },
        });
    }

    return window.socketIoInstance;
}

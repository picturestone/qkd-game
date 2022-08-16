import { singletonHook } from 'react-singleton-hook';
import { io, Socket } from 'socket.io-client';
import IClientToServerEvents from '../models/api/IClientToServerEvents';
import IServerToClientEvents from '../models/api/IServerToClientEvents';
import AuthStorage from './AuthStorage';

function getSocket() {
    const socket: Socket<IServerToClientEvents, IClientToServerEvents> = io({
        extraHeaders: {
            authorization: new AuthStorage().getToken() || '',
        },
    });

    function connectSocket() {
        if (!socket.connected) {
            console.log('trying to connect socket');
            socket.connect();
            setTimeout(() => {
                connectSocket();
            }, 5000);
        }
    }

    connectSocket();

    return socket;
}

// TODO Singleton hook is not yet using the new render method of react 18.
// See https://github.com/Light-Keeper/react-singleton-hook/issues/479
export const useSocket = singletonHook(undefined, getSocket);

import { io, Socket } from 'socket.io-client';
import IClientToServerEvents from '../models/api/IClientToServerEvents';
import IServerToClientEvents from '../models/api/IServerToClientEvents';
import AuthStorage from './AuthStorage';

class IO {
    private static _instance: IO;
    private _socket: Socket<IServerToClientEvents, IClientToServerEvents>;

    constructor() {
        this._socket = io(
            process.env.SOCKETIO_CONNECTION_STRING || 'ws://localhost:3001',
            {
                extraHeaders: {
                    authorization: new AuthStorage().getToken() || '',
                },
            }
        );
    }

    static getInstance() {
        if (!IO._instance) {
            IO._instance = new IO();
        }

        return IO._instance;
    }

    get socket() {
        return this._socket;
    }
}

export default IO;

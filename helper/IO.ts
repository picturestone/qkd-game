import passport from 'passport';
import { Server, Socket } from 'socket.io';
import { JWT_AUTH_MIDDLEWARE } from '../auth/jwt';
import { SOCKETIO_PORT } from './Config';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';

const wrap = (middleware: any) => (socket: Socket, next: any) =>
    middleware(socket.request, {}, next);

class IO {
    private static _instance: IO;
    private _server;

    constructor() {
        this._server = new Server<
            IClientToServerEvents,
            IServerToClientEvents,
            IInterServerEvents,
            ISocketData
        >(parseInt(SOCKETIO_PORT));
        // TODO re-add middleware for authentication.
        // this._server.use(wrap(passport.initialize()));
        // this._server.use(wrap(JWT_AUTH_MIDDLEWARE));
    }

    static getInstance() {
        if (!IO._instance) {
            IO._instance = new IO();
        }

        return IO._instance;
    }

    get server() {
        return this._server;
    }
}

export default IO;

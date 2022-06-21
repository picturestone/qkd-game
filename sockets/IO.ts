import passport from 'passport';
import { Server, Socket } from 'socket.io';
import { JWT_AUTH_MIDDLEWARE } from '../auth/jwt';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import { Server as HttpServer } from 'http';
import User from '../models/User';
import { default as registerLobbySocketIOEvents } from './LobbyHandler';

const wrap = (middleware: any) => (socket: Socket, next: any) =>
    middleware(socket.request, {}, next);

// Custom extension of IncomingMessage class to accomodate socket.request.user that is added by auth middleware.
declare module 'http' {
    interface IncomingMessage {
        user?: User;
    }
}

class IO {
    private static _instance: IO;
    private _server?: Server<
        IClientToServerEvents,
        IServerToClientEvents,
        IInterServerEvents,
        ISocketData
    >;

    constructor() {}

    static getInstance() {
        if (!IO._instance) {
            IO._instance = new IO();
        }

        return IO._instance;
    }

    configurate(httpServer: HttpServer) {
        // TODO set cors correctly.
        this._server = new Server<
            IClientToServerEvents,
            IServerToClientEvents,
            IInterServerEvents,
            ISocketData
        >(httpServer, {
            cors: {
                origin: '*',
            },
        });

        // TODO currently unauthenticated connections are not logged. Log this or send some response.
        this._server.use(wrap(passport.initialize()));
        this._server.use(wrap(JWT_AUTH_MIDDLEWARE));

        registerLobbySocketIOEvents(this._server);
    }

    get server() {
        return this._server;
    }
}

export default IO;

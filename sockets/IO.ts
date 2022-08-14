import passport from 'passport';
import { Server, Socket } from 'socket.io';
import { JWT_AUTH_MIDDLEWARE } from '../auth/jwt';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import { Server as HttpServer } from 'http';
import { default as registerLobbySocketIOEvents } from './LobbyHandler';
import { default as registerGameSocketIOEvents } from './GameHandler';
import IUser = Express.User;
import LobbyDb from '../database/LobbyDb';
import GameDb from '../database/GameDb';
import UserDb from '../database/UserDb';

const wrap = (middleware: any) => (socket: Socket, next: any) =>
    middleware(socket.request, {}, next);

// Custom extension of IncomingMessage class to accomodate socket.request.user that is added by auth middleware.
declare module 'http' {
    interface IncomingMessage {
        user?: IUser;
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

        // TODO remove socketId reference on disconnect.
        this._server.on('connect', (socket) => {
            const user = socket.request.user;
            if (user) {
                user.socketId = socket.id;
            }

            // TODO somehow make sure that a user gets back into the lobby. maybe ask before leaving.
            socket.on('disconnecting', () => {
                const user = socket.request.user;
                if (user && user.id) {
                    const lobbyDb = new LobbyDb();
                    const gameDb = new GameDb();
                    socket.rooms.forEach((val) => {
                        if (val !== socket.id) {
                            lobbyDb.findById(val).then((lobby) => {
                                if (lobby) {
                                    lobby.leave(socket);
                                } else {
                                    gameDb.findById(val).then((game) => {
                                        if (game) {
                                            game.leave(socket);
                                        }
                                    });
                                }
                            });
                        }
                    });
                    new UserDb().delete(user.id);
                }
            });
        });

        registerLobbySocketIOEvents(this._server);
        registerGameSocketIOEvents(this._server);
    }

    get server() {
        if (this._server) {
            return this._server;
        } else {
            throw new Error(
                'configurate() must be called to set up the server'
            );
        }
    }
}

export default IO;

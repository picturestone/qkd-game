"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const socket_io_1 = require("socket.io");
const jwt_1 = require("../auth/jwt");
const LobbyHandler_1 = __importDefault(require("./LobbyHandler"));
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
class IO {
    constructor() { }
    static getInstance() {
        if (!IO._instance) {
            IO._instance = new IO();
        }
        return IO._instance;
    }
    configurate(httpServer) {
        // TODO set cors correctly.
        this._server = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
            },
        });
        // TODO currently unauthenticated connections are not logged. Log this or send some response.
        this._server.use(wrap(passport_1.default.initialize()));
        this._server.use(wrap(jwt_1.JWT_AUTH_MIDDLEWARE));
        // TODO remove socketId reference on disconnect.
        this._server.on('connect', (socket) => {
            const user = socket.request.user;
            if (user) {
                user.socketId = socket.id;
            }
        });
        (0, LobbyHandler_1.default)(this._server);
    }
    get server() {
        if (this._server) {
            return this._server;
        }
        else {
            throw new Error('configurate() must be called to set up the server');
        }
    }
}
exports.default = IO;

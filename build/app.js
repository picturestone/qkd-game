"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
require("dotenv/config");
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const usersRouter_1 = __importDefault(require("./routes/usersRouter"));
const lobbiesRouter_1 = __importDefault(require("./routes/lobbiesRouter"));
const Config_1 = require("./helper/Config");
const jwt_1 = require("./auth/jwt");
const http_1 = require("http");
const IO_1 = __importDefault(require("./sockets/IO"));
const gamesRouter_1 = __importDefault(require("./routes/gamesRouter"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use(express_1.default.static(path_1.default.join(__dirname, '../qkd-game-client/build')));
// Specific API routes
app.use('/api/users', usersRouter_1.default);
// TODO find better way to make nested route for all that are under /api.
// TODO maybe add authenticate middleware for jwt
app.use('/api/lobbies', jwt_1.JWT_AUTH_MIDDLEWARE, lobbiesRouter_1.default);
app.use('/api/games', jwt_1.JWT_AUTH_MIDDLEWARE, gamesRouter_1.default);
// Everything else is given to index route, which returns the react app.
app.use('*', indexRouter_1.default);
const httpServer = (0, http_1.createServer)(app);
IO_1.default.getInstance().configurate(httpServer);
httpServer.listen(Config_1.PORT, () => {
    console.log(`Server is running at http://localhost:${Config_1.PORT}`);
});

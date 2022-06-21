import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import passport from 'passport';
import 'dotenv/config';

import indexRouter from './routes/indexRouter';
import usersRouter from './routes/usersRouter';
import lobbiesRouter from './routes/lobbiesRouter';
import { SERVER_PORT } from './helper/Config';
import { JWT_AUTH_MIDDLEWARE } from './auth/jwt';
import { createServer } from 'http';
import IO from './sockets/IO';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../qkd-game-client/build')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
// TODO find better way to make nested route for all that are under /api.
// TODO maybe add authenticate middleware for jwt
app.use('/api/lobbies', JWT_AUTH_MIDDLEWARE, lobbiesRouter);

const httpServer = createServer(app);
IO.getInstance().configurate(httpServer);

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server is running at http://localhost:${SERVER_PORT}`);
});

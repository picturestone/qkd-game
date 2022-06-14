import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import passport from 'passport';
import 'dotenv/config';

import indexRouter from './routes/indexRouter';
import usersRouter from './routes/usersRouter';
import lobbiesRouter from './routes/lobbiesRouter';

const app = express();
const PORT = process.env.PORT || '3001';
// TODO add env-checker function which checks if all required env params are set, e.g. jwt secret

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
app.use(
    '/api/lobbies',
    passport.authenticate('jwt', { session: false }),
    lobbiesRouter
);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

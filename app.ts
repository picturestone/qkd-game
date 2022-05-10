import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import lobbiesRouter from './routes/lobbies';

const app = express();
const PORT = process.env.PORT || '3001';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../qkd-game-client/build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// TODO find better way to make nested route for all that are under /api.
app.use('/api/lobbies', lobbiesRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
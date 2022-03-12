import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT || '3000';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
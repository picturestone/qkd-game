import express from 'express';
import User from '../models/User';
import UserDb from '../database/UserDb';
import { generateAccessToken } from '../auth/jwt';
import IUserJson from '../qkd-game-client/src/models/api/IUserJson';

const router = express.Router();
const userDb = new UserDb();

router.post('/', function (req, res) {
    const userJson: IUserJson = {
        name: req.body.name,
    };
    const userModel = User.fromJson(userJson);
    userDb.create(userModel).then((createdUser) => {
        res.status(201).send(`Bearer ${generateAccessToken(createdUser)}`);
    });
});

export default router;

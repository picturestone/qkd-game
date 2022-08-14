import express from 'express';
import User from '../models/User';
import UserDb from '../database/UserDb';
import { generateAccessToken } from '../auth/jwt';
import IUserJson from '../qkd-game-client/src/models/api/IUserJson';
import Validator from '../helper/Validator';

const router = express.Router();
const userDb = new UserDb();
const validator = new Validator();

router.post('/', function (req, res) {
    const userJson: IUserJson = {
        name: req.body.name,
    };
    if (validator.isIUserJson(userJson)) {
        const userModel = User.fromJson(userJson);
        userDb.create(userModel).then((createdUser) => {
            res.status(201).send(`Bearer ${generateAccessToken(createdUser)}`);
        });
    } else {
        res.status(400).send('invalid user json');
    }
});

export default router;

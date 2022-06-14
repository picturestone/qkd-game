import express from 'express';
import User from '../models/User';
import UserDb from '../database/UserDb';
import { generateAccessToken } from '../auth/jwt';

const router = express.Router();
const userDb = new UserDb();

router.post('/', function (req, res) {
    const userModel = User.fromJson(req.body);
    userDb.create(userModel).then((createdUser) => {
        res.status(201).send(`Bearer ${generateAccessToken(createdUser)}`);
    });
});

export default router;

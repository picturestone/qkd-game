import express from 'express';
import User from '../models/User';
import IUserJson from '../qkd-game-client/src/models/api/IUserJson';
import UserDb from '../database/UserDb';
import { generateAccessToken } from '../auth/jwt';

const router = express.Router();
const userDb = new UserDb();

router.post('/', function (req, res) {
    const userModel = jsonToModel(req.body);
    userDb.create(userModel).then((createdUser) => {
        res.status(201).send(`Bearer ${generateAccessToken(createdUser)}`);
    });
});

function jsonToModel(json: IUserJson): User {
    return new User(json.name);
}

function modelToJson(model: User): IUserJson {
    return {
        name: model.name,
    };
}

export default router;

import express from 'express';
import User from '../models/User';
import IUserJson from '../qkd-game-client/src/models/api/IUserJson';
const router = express.Router();

// TODO use database instead of in-memory
const users = new Array<User>();

router.get('/', function(req, res) {
  const lobbyJson = new Array<IUserJson>();
  users.map((lobbyModel) => {
    lobbyJson.push(modelToJson(lobbyModel));
  })
  res.send(lobbyJson);
});

router.post('/', function(req, res) {
  const lobbyModel = jsonToModel(req.body);
  users.push(lobbyModel);
  res.status(201).send(modelToJson(lobbyModel));
});

function jsonToModel(json: IUserJson): User {
  return new User(
      json.name
  );
}

function modelToJson(model: User): IUserJson {
  return {
      name: model.name
  };
}

export default router;

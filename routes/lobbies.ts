import express from 'express';
import Lobby from '../models/Lobby';
import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';
const router = express.Router();

// TODO use database instead of in-memory
const lobbies = new Array<Lobby>();
// TODO remove sample data
lobbies.push(new Lobby('test-lobby'));

router.get('/', function(req, res) {
  const lobbyJson = new Array<ILobbyJson>();
  lobbies.map((lobbyModel) => {
    lobbyJson.push(modelToJson(lobbyModel));
  })
  res.send(lobbyJson);
});

router.post('/', function(req, res) {
  const lobbyModel = jsonToModel(req.body);
  lobbies.push(lobbyModel);
  res.status(201).send(modelToJson(lobbyModel));
});

// TODO error handling
function jsonToModel(json: ILobbyJson): Lobby {
  return new Lobby(
      json.name
  );
}

function modelToJson(model: Lobby): ILobbyJson {
  return {
      name: model.name
  };
}

export default router;

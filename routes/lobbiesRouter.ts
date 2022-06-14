import express from 'express';
import LobbyDb from '../database/LobbyDb';
import Lobby from '../models/Lobby';
import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';

const router = express.Router();
const lobbyDb = new LobbyDb();

router.get('/', async function (req, res) {
    const lobbyJson = new Array<ILobbyJson>();
    const lobbies = await lobbyDb.getAll();
    lobbies.map((lobbyModel) => {
        lobbyJson.push(lobbyModel.toJson());
    });
    res.send(lobbyJson);
});

router.post('/', async function (req, res) {
    const lobbyModel = Lobby.fromJson(req.body);
    const savedLobby = await lobbyDb.create(lobbyModel);
    res.status(201).send(savedLobby.toJson());
});

export default router;

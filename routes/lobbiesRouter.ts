import express from 'express';
import GameDb from '../database/GameDb';
import LobbyDb from '../database/LobbyDb';
import Game from '../models/Game';
import Lobby from '../models/Lobby';
import IO from '../sockets/IO';
import HumanAliceController from '../models/player/HumanAliceController';
import HumanBobController from '../models/player/HumanBobController';
import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';

const router = express.Router();
const lobbyDb = new LobbyDb();
const gameDb = new GameDb();

router.get('/', async function (req, res) {
    const lobbyJson = new Array<ILobbyJson>();
    const lobbies = await lobbyDb.findAll();
    lobbies.map((lobbyModel) => {
        lobbyJson.push(lobbyModel.toJson());
    });
    res.send(lobbyJson);
});

router.get('/:id', async function (req, res) {
    const lobby = await lobbyDb.findById(req.params.id);
    if (lobby) {
        res.send(lobby.toJson());
    } else {
        res.status(404);
    }
});

router.post('/', async function (req, res) {
    const lobbyJson: ILobbyJson = {
        name: req.body.name,
        owner: req.body.owner,
        noOfQbits: req.body.noOfQbits,
    };
    const lobbyModel = Lobby.fromJson(lobbyJson);
    const savedLobby = await lobbyDb.create(lobbyModel);
    res.status(201).send(savedLobby.toJson());
});

export default router;

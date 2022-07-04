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
    };
    const lobbyModel = Lobby.fromJson(lobbyJson);
    const savedLobby = await lobbyDb.create(lobbyModel);
    res.status(201).send(savedLobby.toJson());
});

// TODO this should really be done by a socket request, not a route. This emits an event to all clients which does not make sense if its a post request.
router.post('/:id/start', async function (req, res) {
    const lobby = await lobbyDb.findById(req.params.id);

    if (lobby && lobby.id) {
        if (req.user?.id === lobby.owner.id) {
            if (
                lobby.reservedAlice &&
                lobby.reservedAlice.socketId &&
                lobby.reservedBob &&
                lobby.reservedBob.socketId
            ) {
                const ioServer = IO.getInstance().server;

                // Make all sockets in the lobby room leave.
                ioServer.in(lobby.id).socketsLeave(lobby.id);
                const aliceController = new HumanAliceController(
                    lobby.reservedAlice
                );
                const bobController = new HumanBobController(lobby.reservedBob);
                const game = new Game(aliceController, bobController);
                const savedGame = await gameDb.create(game);
                savedGame.startGame();
                // TODO maybe send game as json.
                res.status(201).send();
            } else {
                res.statusMessage =
                    'Alice and Bob roles have not been taken, or their sockets are not connected';
                res.status(400);
            }
        } else {
            res.status(401);
        }
    } else {
        res.status(404);
    }
});

export default router;

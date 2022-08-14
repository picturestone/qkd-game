import express from 'express';
import LobbyDb from '../database/LobbyDb';
import Lobby from '../models/Lobby';
import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';
import Validator from '../helper/Validator';

const router = express.Router();
const lobbyDb = new LobbyDb();
const validator = new Validator();

router.get('/', function (req, res) {
    const lobbyJson = new Array<ILobbyJson>();
    lobbyDb
        .findAll()
        .then((lobbies) => {
            lobbies.map((lobbyModel) => {
                lobbyJson.push(lobbyModel.toJson());
            });
            res.send(lobbyJson);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get('/:id', function (req, res) {
    const id = req.params.id;
    if (validator.isId(id)) {
        lobbyDb
            .findById(id)
            .then((lobby) => {
                if (lobby) {
                    res.send(lobby.toJson());
                } else {
                    res.status(404).send();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.status(400).send('invalid :id');
    }
});

router.post('/', function (req, res) {
    const lobbyJson: ILobbyJson = {
        name: req.body.name,
        owner: req.body.owner,
        noOfQbits: req.body.noOfQbits,
        isEveAllowed: req.body.isEveAllowed,
    };
    if (validator.isILobbyJson(lobbyJson)) {
        const lobbyModel = Lobby.fromJson(lobbyJson);
        lobbyDb
            .create(lobbyModel)
            .then((savedLobby) => {
                res.status(201).send(savedLobby.toJson());
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.status(400).send('invalid lobby json');
    }
});

export default router;

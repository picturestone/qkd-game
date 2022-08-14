import express from 'express';
import GameDb from '../database/GameDb';
import Validator from '../helper/Validator';

const router = express.Router();
const gameDb = new GameDb();
const validator = new Validator();

router.get('/:id', function (req, res) {
    const id = req.params.id;
    if (validator.isId(id)) {
        gameDb
            .findById(id)
            .then((game) => {
                if (game && game.id) {
                    const aliceId = game.alicePlayer.humanPlayer?.userId;
                    const bobId = game.bobPlayer.humanPlayer?.userId;
                    const eveId = game.evePlayer?.humanPlayer?.userId;
                    if (
                        (aliceId && req.user?.id === aliceId) ||
                        (bobId && req.user?.id === bobId) ||
                        (eveId && req.user?.id === eveId)
                    ) {
                        res.send(game.toJson());
                    } else {
                        res.status(401).send();
                    }
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

export default router;

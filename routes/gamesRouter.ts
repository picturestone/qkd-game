import express from 'express';
import GameDb from '../database/GameDb';
import Game from '../models/Game';

const router = express.Router();
const gameDb = new GameDb();

// TODO extend with eve
router.get('/:id', async function (req, res) {
    const game = await gameDb.findById(req.params.id);

    if (game && game.id) {
        const aliceId = game.alicePlayer.controller.userId;
        const bobId = game.bobPlayer.controller.userId;
        if (
            (aliceId && req.user?.id === aliceId) ||
            (bobId && req.user?.id === bobId)
        ) {
            res.send(game.toJson());
        } else {
            res.status(401).send();
        }
    } else {
        res.status(404).send();
    }
});

export default router;

import express from 'express';
import GameDb from '../database/GameDb';

const router = express.Router();
const gameDb = new GameDb();

router.get('/:id', function (req, res) {
    gameDb
        .findById(req.params.id)
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
});

// TODO send each code via socket.io
// Get callback for confirming and waiting for all players
// When all are sent, send from server to client "all codes sent event"
// Redirect users to their respective code comparison page aliceBobComparison and eveComparison
// Make get request to get the data and show it accordingly
// From there on think about how it should be communicated who won.

export default router;

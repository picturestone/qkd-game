import express from 'express';
const router = express.Router();

/* GET lobbies listing. */
router.get('/', function(req, res, next) {
  res.send([
    {
      'name': 'lobby 1',
    },
    {
      'name': 'lobby 2',
    },
    {
      'name': 'lobby test',
    }
  ]);
});

export default router;

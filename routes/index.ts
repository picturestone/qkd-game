import express from 'express';
import path from 'path';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(
    path.join(__dirname, '../qkd-game-client/build/index.html')
  );
});

export default router;

Requirements:

-   Node 16
-   NPM 8

Setup steps:

1. Execute `git clone git@github.com:picturestone/qkd-game.git`
2. Execute `cd qkd-game`
3. Execute `npm install`
4. Execute `cd qkd-game-client`
5. Exeucte `npm install`

Start for development:

1. Navigate to the qkd-game directory
2. Execute `npm run dev`
3. Go to `http://localhost:3000`

Start for production:

1. Navigate to the qkd-game directory
2. Execute `npm run build`
3. Execute `npm run start`
4. Go to `http://localhost:3001`

About `npm audit` and create-react-app:

NPM audit spits out a false positive vulnerability in the react-scripts package. This is only needed for development. Thus it was moved to a dev-dependency. `npm audit --production` shows no vulnerabilites now. See [github issue](https://github.com/facebook/create-react-app/issues/11174)

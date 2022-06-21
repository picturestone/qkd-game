import QuantumChannel from './channel/QuantumChannel';
import AliceController from './player/AliceController';
import AlicePlayer from './player/AlicePlayer';
import BobController from './player/BobController';
import BobPlayer from './player/BobPlayer';
import UserAliceController from './player/UserAliceController';
import UserBobController from './player/UserBobController';
import User from './User';

export default class Game {
    private _id?: string;
    private isStartet = false;
    private _alicePlayer: AlicePlayer;
    private _bobPlayer: BobPlayer;

    constructor(
        aliceController: AliceController,
        bobController: BobController,
        id?: string
    ) {
        this._id = id;

        const aliceBobQuantumConnection = new QuantumChannel();
        this._alicePlayer = new AlicePlayer(
            aliceController,
            aliceBobQuantumConnection
        );
        this._bobPlayer = new BobPlayer(
            bobController,
            aliceBobQuantumConnection
        );
    }

    public startGame() {
        if (!this.isStartet) {
            this._alicePlayer.controller.startGame();
            this._bobPlayer.controller.startGame();
        }
    }

    public set id(id: string | undefined) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }
}

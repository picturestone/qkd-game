import QuantumChannel from './channel/QuantumChannel';
import AliceController from './player/AliceController';
import AlicePlayer from './player/AlicePlayer';
import BobController from './player/BobController';
import BobPlayer from './player/BobPlayer';
import IGameJson from '../qkd-game-client/src/models/api/IGameJson';
import BasisComparisonChannel from './channel/BasisComparisonChannel';
import qbitDiscardChannel from './channel/QbitDiscardChannel';

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
        const aliceBobBasisComparisonConnection = new BasisComparisonChannel();
        const aliceBobQbitDiscardConnection = new qbitDiscardChannel();
        this._alicePlayer = new AlicePlayer(
            aliceController,
            aliceBobQuantumConnection,
            aliceBobBasisComparisonConnection,
            aliceBobQbitDiscardConnection
        );
        this._bobPlayer = new BobPlayer(
            bobController,
            aliceBobQuantumConnection,
            aliceBobBasisComparisonConnection,
            aliceBobQbitDiscardConnection
        );
    }

    public startGame() {
        if (!this.isStartet) {
            this._alicePlayer.controller.startGame(this);
            this._bobPlayer.controller.startGame(this);
            this.isStartet = true;
        }
    }

    public set id(id: string | undefined) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    public get alicePlayer() {
        return this._alicePlayer;
    }

    public get bobPlayer() {
        return this._bobPlayer;
    }

    toJson(): IGameJson {
        return {
            id: this._id,
        };
    }
}

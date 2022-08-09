import QuantumChannel from './channel/QuantumChannel';
import AliceController from './player/AliceController';
import AlicePlayer from './player/AlicePlayer';
import BobController from './player/BobController';
import BobPlayer from './player/BobPlayer';
import IGameJson from '../qkd-game-client/src/models/api/IGameJson';
import BasisComparisonChannel from './channel/BasisComparisonChannel';
import qbitDiscardChannel from './channel/QbitDiscardChannel';
import EveController from './player/EveController';
import EvePlayer from './player/EvePlayer';

export default class Game {
    private _id?: string;
    private isStartet = false;
    private _alicePlayer: AlicePlayer;
    private _bobPlayer: BobPlayer;
    private _evePlayer?: EvePlayer;
    private _noOfQbits: number;

    constructor(
        noOfQbits: number,
        alicePlayer: AlicePlayer,
        bobPlayer: BobPlayer,
        evePlayer?: EvePlayer,
        id?: string
    ) {
        this._id = id;
        this._noOfQbits = noOfQbits;
        this._alicePlayer = alicePlayer;
        this._bobPlayer = bobPlayer;
        this._evePlayer = evePlayer;
    }

    public startGame() {
        if (!this.isStartet) {
            this._alicePlayer.controller.startGame(this);
            this._bobPlayer.controller.startGame(this);
            this._evePlayer?.controller.startGame(this);
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

    public get evePlayer() {
        return this._evePlayer;
    }

    toJson(): IGameJson {
        return {
            id: this._id,
            noOfQbits: this._noOfQbits,
        };
    }
}

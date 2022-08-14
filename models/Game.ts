import AlicePlayer from './player/AlicePlayer';
import BobPlayer from './player/BobPlayer';
import IGameJson from '../qkd-game-client/src/models/api/IGameJson';
import EvePlayer from './player/EvePlayer';
import IO from '../sockets/IO';
import { Socket } from 'socket.io';
import LobbyDb from '../database/LobbyDb';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import GameDb from '../database/GameDb';

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
        this._alicePlayer.game = this;
        this._bobPlayer.game = this;

        if (this._evePlayer) {
            this._evePlayer.game = this;
        }
    }

    public startGame() {
        if (!this.isStartet) {
            this._alicePlayer.startGame();
            this._bobPlayer.startGame();
            this._evePlayer?.startGame();
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

    public leave(
        socket: Socket<
            IClientToServerEvents,
            IServerToClientEvents,
            IInterServerEvents,
            ISocketData
        >
    ) {
        const userId = socket.request.user?.id;
        if (this.id && userId) {
            new GameDb().delete(this.id).then((deletedGame) => {
                if (deletedGame && deletedGame.id) {
                    deletedGame._alicePlayer.onOtherPlayerLeftGame(this);
                    deletedGame._bobPlayer.onOtherPlayerLeftGame(this);
                    deletedGame._evePlayer?.onOtherPlayerLeftGame(this);
                }
            });
        }
    }

    public onCodePublished() {
        const aliceCode = this._alicePlayer.publishedCode;
        const bobCode = this._bobPlayer.publishedCode;
        if (aliceCode !== undefined && bobCode !== undefined) {
            [this._alicePlayer, this._bobPlayer].forEach((player) => {
                player.onAllCodesPublished(aliceCode, bobCode);
            });
        }
    }

    public getGameResults() {
        const aliceCode = this._alicePlayer.publishedCode;
        const bobCode = this._bobPlayer.publishedCode;
        const eveCode = this._evePlayer?.publishedCode;
        const isAliceThinkingEveListenedIn =
            this._alicePlayer.isThinkingEveListenedIn;
        const isBobThinkingEveListenedIn =
            this._bobPlayer.isThinkingEveListenedIn;
        if (
            this.alicePlayer.isDoneWithGame &&
            this.bobPlayer.isDoneWithGame &&
            (this.evePlayer === undefined || this.evePlayer.isDoneWithGame) &&
            aliceCode &&
            bobCode &&
            isAliceThinkingEveListenedIn !== undefined &&
            isBobThinkingEveListenedIn !== undefined
        ) {
            return {
                aliceCode,
                bobCode,
                isAliceThinkingEveListenedIn,
                isBobThinkingEveListenedIn,
                eveCode,
            };
        } else {
            return undefined;
        }
    }

    public onPlayerDoneWithGame() {
        const results = this.getGameResults();
        if (results) {
            [this.alicePlayer, this.bobPlayer, this.evePlayer].forEach(
                (player) => {
                    if (player) {
                        player.onAllPlayersDoneWithGame(
                            results.aliceCode,
                            results.bobCode,
                            results.isAliceThinkingEveListenedIn,
                            results.isBobThinkingEveListenedIn,
                            results.eveCode
                        );
                    }
                }
            );
        }
    }

    toJson(): IGameJson {
        return {
            id: this._id,
            noOfQbits: this._noOfQbits,
        };
    }
}

import IUser = Express.User;
import IO from '../../sockets/IO';
import Game from '../Game';

export default class HumanPlayer {
    private _user: IUser;

    constructor(user: IUser) {
        this._user = user;
    }

    public startGame(game: Game | undefined) {
        if (game) {
            this.socket.emit('startedGame', game.toJson());
        }
    }

    public allPlayersDoneWithGame(
        aliceCode: string,
        bobCode: string,
        isAliceThinkingEveListenedIn: boolean,
        isBobThinkingEveListenedIn: boolean,
        eveCode?: string
    ): void {
        this.socket.emit('allPlayersDoneWithGame', {
            aliceCode: aliceCode,
            bobCode: bobCode,
            eveCode: eveCode,
            isAliceThinkingEveListenedIn: isAliceThinkingEveListenedIn,
            isBobThinkingEveListenedIn: isBobThinkingEveListenedIn,
        });
    }

    get userId() {
        return this._user.id;
    }

    get socket() {
        if (this._user.socketId) {
            return IO.getInstance().server.to(this._user.socketId);
        } else {
            throw new Error('SocketID on alice user is not defined.');
        }
    }
}

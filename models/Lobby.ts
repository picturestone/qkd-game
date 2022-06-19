import IO from '../helper/IO';
import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';
import User from './User';

export default class Lobby {
    private _id?: string;
    private _name: string;
    private _owner: User;

    constructor(name: string, owner: User, id?: string) {
        this._name = name;
        this._owner = owner;
        this._id = id;
        this.registerSocketIOEvents();
    }

    private registerSocketIOEvents() {
        const server = IO.getInstance().server;
        server.on('connect', (socket) => {
            socket.on('joinRoom', (roomId) => {
                if (roomId === this._id) {
                    console.log(socket);
                    // TODO join the socket to the room, check if the user is authenticated via the token, broadcast to room that someone joined.
                    // socket.join(this._id);
                }
            });
        });
    }

    public setId(id?: string) {
        this._id = id;
    }

    public getId() {
        return this._id;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get name() {
        return this._name;
    }

    public set owner(owner: User) {
        this._owner = owner;
    }

    public get owner() {
        return this._owner;
    }

    static fromJson(json: ILobbyJson) {
        return new Lobby(json.name, User.fromJson(json.owner), json.id);
    }

    toJson(): ILobbyJson {
        return {
            name: this._name,
            owner: this._owner.toJson(),
            id: this._id,
        };
    }
}

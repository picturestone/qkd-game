import { Server } from 'socket.io';
import IO from '../sockets/IO';
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
    }

    public set id(id: string | undefined) {
        this._id = id;
    }

    public get id() {
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

import { Socket } from 'socket.io';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import IUserJson from '../qkd-game-client/src/models/api/IUserJson';

export default class User {
    private _name: string;
    private _id?: string;
    private _socketId?: string;

    constructor(name: string, id?: string) {
        this._name = name;
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

    public set socketId(socketId: string | undefined) {
        this._socketId = socketId;
    }

    public get socketId() {
        return this._socketId;
    }

    static fromJson(json: IUserJson) {
        return new User(json.name, json.id);
    }

    toJson(): IUserJson {
        return {
            name: this._name,
            id: this._id,
        };
    }
}

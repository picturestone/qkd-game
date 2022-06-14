import ILobbyJson from './api/ILobbyJson';
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

    public set owner(owner: User) {
        this._owner = owner;
    }

    public get owner() {
        return this._owner;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get name() {
        return this._name;
    }

    public setId(id?: string) {
        this._id = id;
    }

    public getId() {
        return this._id;
    }

    static fromJson(json: ILobbyJson) {
        return new Lobby(json.name, User.fromJson(json.owner), json.id);
    }

    toJson(): ILobbyJson {
        return {
            id: this._id,
            name: this._name,
            owner: this._owner.toJson(),
        };
    }
}

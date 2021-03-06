import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';
import User from './User';

export default class Lobby {
    private _id?: string;
    private _name: string;
    private _owner: User;
    private _reservedAlice?: User;
    private _reservedBob?: User;

    constructor(
        name: string,
        owner: User,
        id?: string,
        reservedAlice?: User,
        reservedBob?: User
    ) {
        this._name = name;
        this._owner = owner;
        this._id = id;
        this._reservedAlice = reservedAlice;
        this._reservedBob = reservedBob;
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

    public get reservedAlice() {
        return this._reservedAlice;
    }

    public set reservedAlice(value: User | undefined) {
        this._reservedAlice = value;
    }

    public get reservedBob() {
        return this._reservedBob;
    }

    public set reservedBob(value: User | undefined) {
        this._reservedBob = value;
    }

    static fromJson(json: ILobbyJson) {
        const reservedAliceUser = json.reservedAlice
            ? User.fromJson(json.reservedAlice)
            : undefined;
        const reservedBobUser = json.reservedBob
            ? User.fromJson(json.reservedBob)
            : undefined;
        return new Lobby(
            json.name,
            User.fromJson(json.owner),
            json.id,
            reservedAliceUser,
            reservedBobUser
        );
    }

    toJson(): ILobbyJson {
        return {
            name: this._name,
            owner: this._owner.toJson(),
            id: this._id,
            reservedAlice: this._reservedAlice?.toJson(),
            reservedBob: this._reservedBob?.toJson(),
        };
    }
}

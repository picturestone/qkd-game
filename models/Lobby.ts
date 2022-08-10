import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';
import User from './User';
import IUser = Express.User;

export default class Lobby {
    private _id?: string;
    private _name: string;
    private _owner: IUser;
    private _isEveAllowed: boolean;
    private _reservedAlice?: IUser;
    private _reservedBob?: IUser;
    private _reservedEve?: IUser;
    private _noOfQbits: number;

    constructor(
        name: string,
        owner: IUser,
        noOfQbits: number,
        isEveAllowed: boolean,
        id?: string,
        reservedAlice?: IUser,
        reservedBob?: IUser,
        reservedEve?: IUser
    ) {
        this._name = name;
        this._owner = owner;
        this._id = id;
        this._isEveAllowed = isEveAllowed;
        this._reservedAlice = reservedAlice;
        this._reservedBob = reservedBob;
        this._reservedEve = reservedEve;
        this._noOfQbits = noOfQbits;
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

    public set owner(owner: IUser) {
        this._owner = owner;
    }

    public get owner() {
        return this._owner;
    }

    public get reservedEve() {
        return this._reservedEve;
    }

    public set reservedEve(value: IUser | undefined) {
        this._reservedEve = value;
    }

    public get reservedAlice() {
        return this._reservedAlice;
    }

    public set reservedAlice(value: IUser | undefined) {
        this._reservedAlice = value;
    }

    public get reservedBob() {
        return this._reservedBob;
    }

    public set reservedBob(value: IUser | undefined) {
        this._reservedBob = value;
    }

    public set noOfQbits(value: number) {
        this._noOfQbits = value;
    }

    public get noOfQbits() {
        return this._noOfQbits;
    }

    public get isEveAllowed() {
        return this._isEveAllowed;
    }

    public set isEveAllowed(value: boolean) {
        this._isEveAllowed = value;
    }

    static fromJson(json: ILobbyJson) {
        const reservedAliceUser = json.reservedAlice
            ? User.fromJson(json.reservedAlice)
            : undefined;
        const reservedBobUser = json.reservedBob
            ? User.fromJson(json.reservedBob)
            : undefined;
        const reservedEveUser = json.reservedEve
            ? User.fromJson(json.reservedEve)
            : undefined;
        return new Lobby(
            json.name,
            User.fromJson(json.owner),
            json.noOfQbits,
            json.isEveAllowed,
            json.id,
            reservedAliceUser,
            reservedBobUser,
            reservedEveUser
        );
    }

    toJson(): ILobbyJson {
        return {
            name: this._name,
            owner: this._owner.toJson(),
            noOfQbits: this._noOfQbits,
            isEveAllowed: this._isEveAllowed,
            id: this._id,
            reservedAlice: this._reservedAlice?.toJson(),
            reservedBob: this._reservedBob?.toJson(),
            reservedEve: this._reservedEve?.toJson(),
        };
    }
}

import AuthStorage from '../helper/AuthStorage';
import ILobbyJson from './api/ILobbyJson';
import { PLAYERROLE } from './api/PlayerRole';
import User from './User';

export default class Lobby {
    private _id?: string;
    private _name: string;
    private _owner: User;
    private _isEveAllowed: boolean;
    private _reservedAlice?: User;
    private _reservedBob?: User;
    private _reservedEve?: User;
    private _noOfQbits: number;

    constructor(
        name: string,
        owner: User,
        noOfQbits: number,
        isEveAllowed: boolean,
        id?: string,
        reservedAlice?: User,
        reservedBob?: User,
        reservedEve?: User
    ) {
        this._name = name;
        this._owner = owner;
        this._noOfQbits = noOfQbits;
        this._isEveAllowed = isEveAllowed;
        this._id = id;
        this._reservedAlice = reservedAlice;
        this._reservedBob = reservedBob;
        this._reservedEve = reservedEve;
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

    public set isEveAllowed(value: boolean) {
        this._isEveAllowed = value;
    }

    public get isEveAllowed() {
        return this._isEveAllowed;
    }

    public set id(id: string | undefined) {
        this._id = id;
    }

    public get id() {
        return this._id;
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

    public get reservedEve() {
        return this._reservedEve;
    }

    public set reservedEve(value: User | undefined) {
        this._reservedEve = value;
    }

    get selectedRole(): PLAYERROLE | undefined {
        let selectedRole = undefined;
        const loggedInUserId = new AuthStorage().getLoggedInUser()?.id;
        switch (loggedInUserId) {
            case this._reservedAlice?.id:
                selectedRole = PLAYERROLE.alice;
                break;

            case this.reservedBob?.id:
                selectedRole = PLAYERROLE.bob;
                break;

            case this.reservedEve?.id:
                selectedRole = PLAYERROLE.eve;
                break;
        }
        return selectedRole;
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

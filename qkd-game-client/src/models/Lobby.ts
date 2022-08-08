import AuthStorage from '../helper/AuthStorage';
import ILobbyJson from './api/ILobbyJson';
import { PLAYERROLE } from './api/PlayerRole';
import User from './User';

export default class Lobby {
    private _id?: string;
    private _name: string;
    private _owner: User;
    private _reservedAlice?: User;
    private _reservedBob?: User;
    private _noOfQbits: number;

    constructor(
        name: string,
        owner: User,
        noOfQbits: number,
        id?: string,
        reservedAlice?: User,
        reservedBob?: User
    ) {
        this._name = name;
        this._owner = owner;
        this._noOfQbits = noOfQbits;
        this._id = id;
        this._reservedAlice = reservedAlice;
        this._reservedBob = reservedBob;
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
        return new Lobby(
            json.name,
            User.fromJson(json.owner),
            json.noOfQbits,
            json.id,
            reservedAliceUser,
            reservedBobUser
        );
    }

    toJson(): ILobbyJson {
        return {
            name: this._name,
            owner: this._owner.toJson(),
            noOfQbits: this._noOfQbits,
            id: this._id,
            reservedAlice: this._reservedAlice?.toJson(),
            reservedBob: this._reservedBob?.toJson(),
        };
    }
}

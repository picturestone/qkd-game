import { Socket } from 'socket.io';
import LobbyDb from '../database/LobbyDb';
import IClientToServerEvents from '../qkd-game-client/src/models/api/IClientToServerEvents';
import IInterServerEvents from '../qkd-game-client/src/models/api/IInterServerEvents';
import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';
import IServerToClientEvents from '../qkd-game-client/src/models/api/IServerToClientEvents';
import ISocketData from '../qkd-game-client/src/models/api/ISocketData';
import IO from '../sockets/IO';
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

    private get server() {
        return IO.getInstance().server;
    }

    public removeUserFromAllRoles(user: IUser | undefined) {
        if (user) {
            const userId = user.id;
            if (this.reservedAlice?.id === userId) {
                this.reservedAlice = undefined;
            }
            if (this.reservedBob?.id === userId) {
                this.reservedBob = undefined;
            }
            if (this.reservedEve?.id === userId) {
                this.reservedEve = undefined;
            }
        }
    }

    public join(
        socket: Socket<
            IClientToServerEvents,
            IServerToClientEvents,
            IInterServerEvents,
            ISocketData
        >
    ) {
        if (this.id && !socket.rooms.has(this.id)) {
            socket.join(this.id);
            this.server
                .to(this.id)
                .emit(
                    'chatMessage',
                    `${socket.request.user?.name} joined the lobby.`
                );
        }
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
        if (this.id && socket.rooms.has(this.id) && userId) {
            if (userId === this.owner.id) {
                if (this.id) {
                    new LobbyDb()
                        .delete(this.id)
                        .then((deletedLobby) => {
                            if (deletedLobby && deletedLobby.id) {
                                this.server
                                    .to(deletedLobby.id)
                                    .emit('ownerLeftLobby', deletedLobby);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            } else {
                socket.leave(this.id);
                this.removeUserFromAllRoles(socket.request.user);
                new LobbyDb().put(this).then((updatedLobby) => {
                    if (updatedLobby && updatedLobby.id) {
                        this.server
                            .to(updatedLobby.id)
                            .emit('updatedLobby', updatedLobby.toJson());
                        this.server
                            .to(updatedLobby.id)
                            .emit(
                                'chatMessage',
                                `${socket.request.user?.name} left the lobby.`
                            );
                    }
                });
            }
        }
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

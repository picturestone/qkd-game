import IUserJson from '../qkd-game-client/src/models/api/IUserJson';

// Passport uses the Express.User interface to extend the Express.Request
// with a 'user' property.
// We also extend the http.IncomingMessage with the user to have access to
// the user in socket.io requests via the 'user' property. This user property
// is also set by the Passport JS middleware. The 'http.IncomingMessage' and
// 'Express.Request' must both have the same type for 'user' since otherwise
// declaration merging would not work. Since we are bound to the Express.User
// interface by Passport JS, we extend this interface with all the properties
// and methods our User implementation needs. This way we can still work with
// our own User, but it is encapsulated in an interface providing the very
// same properties and methods.
declare global {
    namespace Express {
        export interface User {
            name: string;
            id?: string;
            socketId?: string;
            toJson(): IUserJson;
        }
    }
}

export default class User implements Express.User {
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

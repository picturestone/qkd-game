import IUserJson from '../qkd-game-client/src/models/api/IUserJson';

export default class User {
    private _id?: string;
    private _name: string;

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

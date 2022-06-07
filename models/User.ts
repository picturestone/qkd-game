export default class User {
    private _id?: string;
    private _name: string;

    constructor(name: string, id?: string) {
        this._name = name;
        this._id = id;
    }

    public setId(id?: string) {
        this._id = id;
    }

    public getId() {
        return this._id;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get name() {
        return this._name;
    }
}
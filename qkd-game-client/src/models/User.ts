export default class User {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get name() {
        return this._name;
    }
}
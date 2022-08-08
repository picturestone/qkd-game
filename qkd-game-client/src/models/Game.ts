import IGameJson from './api/IGameJson';

export default class Game {
    private _id?: string;
    private _noOfQbits: number;

    constructor(noOfQbits: number, id?: string) {
        this._id = id;
        this._noOfQbits = noOfQbits;
    }

    public set id(id: string | undefined) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    public get noOfQbits() {
        return this._noOfQbits;
    }

    static fromJson(json: IGameJson) {
        return new Game(json.noOfQbits, json.id);
    }
}

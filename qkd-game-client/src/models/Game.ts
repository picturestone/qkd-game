import IGameJson from './api/IGameJson';

export default class Game {
    private _id?: string;

    constructor(id?: string) {
        this._id = id;
    }

    public set id(id: string | undefined) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    static fromJson(json: IGameJson) {
        return new Game(json.id);
    }
}

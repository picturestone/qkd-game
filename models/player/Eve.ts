import ISink from "../channel/ISink";
import ISource from "../channel/ISource";
import PlayerRole from "./PlayerRole";

export default class Eve extends PlayerRole {
    private _source: ISource<any>;
    private _sink: ISink<any>;

    constructor(source: ISource<any>, sink: ISink<any>) {
        super();
        this._source = source;
        this._sink = sink;
    }
}
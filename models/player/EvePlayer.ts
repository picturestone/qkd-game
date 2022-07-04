import ISink from '../channel/ISink';
import ISource from '../channel/ISource';
import Player from './Player';

export default class EvePlayer extends Player {
    private _source: ISource<any>;
    private _sink: ISink<any>;

    constructor(source: ISource<any>, sink: ISink<any>) {
        super();
        this._source = source;
        this._sink = sink;
    }
}

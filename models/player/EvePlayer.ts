import ISink from '../channel/ISink';
import ISource from '../channel/ISource';
import EveController from './EveController';
import Player from './Player';

export default class EvePlayer extends Player {
    private _controller: EveController;
    private _source: ISource<any>;
    private _sink: ISink<any>;

    constructor(
        controller: EveController,
        source: ISource<any>,
        sink: ISink<any>
    ) {
        super(controller);
        this._controller = controller;
        this._source = source;
        this._sink = sink;
    }

    get controller(): EveController {
        return this._controller;
    }
}

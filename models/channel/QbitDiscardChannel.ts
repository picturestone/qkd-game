import IQbitDiscardData from '../../qkd-game-client/src/models/api/IQbitDiscardedData';
import Channel from './Channel';
import IQbitDiscardChannelObserver from './IQbitDiscardChannelObserver';

export default class qbitDiscardChannel extends Channel<IQbitDiscardData> {
    private _queue: IQbitDiscardData[];
    private _observers: IQbitDiscardChannelObserver[];

    constructor() {
        super();
        this._queue = [];
        this._observers = [];
    }

    dequeue(): IQbitDiscardData | undefined {
        return this._queue.shift();
    }

    enqueue(value: IQbitDiscardData): void {
        this._queue.push(value);
        this.notifyObservers();
    }

    public notifyObservers(): void {
        this._observers.forEach((observer) => {
            observer.onQbitDiscardEnqueue();
        });
    }

    public addObserver(observer: IQbitDiscardChannelObserver) {
        this._observers.push(observer);
    }
}

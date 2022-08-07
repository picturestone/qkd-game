import IBasisComparisonData from '../../qkd-game-client/src/models/api/IBasisComparisonData';
import Channel from './Channel';
import IBasisComparisonChannelObserver from './IBasisComparisonChannelObserver';

export default class QuantumChannel extends Channel<IBasisComparisonData> {
    private _queue: IBasisComparisonData[];
    private _observers: IBasisComparisonChannelObserver[];

    constructor() {
        super();
        this._queue = [];
        this._observers = [];
    }

    dequeue(): IBasisComparisonData | undefined {
        return this._queue.shift();
    }

    enqueue(value: IBasisComparisonData): void {
        this._queue.push(value);
        this.notifyObservers();
    }

    public notifyObservers(): void {
        this._observers.forEach((observer) => {
            observer.onBasisComparisonEnqueue();
        });
    }

    public addObserver(observer: IBasisComparisonChannelObserver) {
        this._observers.push(observer);
    }
}

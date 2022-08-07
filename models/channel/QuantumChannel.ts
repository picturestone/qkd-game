import Qbit from '../quantum/Qbit';
import Channel from './Channel';
import IQuantumChannelObserver from './IQuantumChannelObserver';

export default class QuantumChannel extends Channel<Qbit> {
    private _qbitQueue: Qbit[];
    private _observers: IQuantumChannelObserver[];

    constructor() {
        super();
        this._qbitQueue = [];
        this._observers = [];
    }

    dequeue(): Qbit | undefined {
        return this._qbitQueue.shift();
    }

    enqueue(value: Qbit): void {
        this._qbitQueue.push(value);
        this.notifyObservers();
    }

    public notifyObservers(): void {
        this._observers.forEach((observer) => {
            observer.onQbitEnqueue();
        });
    }

    public addObserver(observer: IQuantumChannelObserver) {
        this._observers.push(observer);
    }
}

import IChannelObserver from "./ISourceObserver";
import ISink from "./ISink";
import ISource from "./ISource";

export default abstract class Channel<T> implements ISource<T>, ISink<T> {
    private _observers: IChannelObserver<T>[];

    constructor() {
        this._observers = [];
    }
    
    public abstract enqueue(value: T): void;
    public abstract dequeue(): T | undefined;

    public notifyObservers(): void {
        this._observers.forEach(observer => {
            observer.onEnqueue(this);
        });
    };

    public addObserver(observer: IChannelObserver<T>) {
        this._observers.push(observer);
    }
}
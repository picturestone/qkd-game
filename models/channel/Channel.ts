import ISink from './ISink';
import ISource from './ISource';

export default abstract class Channel<T> implements ISource<T>, ISink<T> {
    public abstract enqueue(value: T): void;
    public abstract dequeue(): T | undefined;
}

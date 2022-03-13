import IChannelObserver from "./ISourceObserver";

export default interface ISource<T> {
    dequeue(): T | undefined;
    addObserver(observer: IChannelObserver<T>): void;
}
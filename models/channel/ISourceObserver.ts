import ISource from "./ISource";

export default interface IChannelObserver<T> {
    onEnqueue(to: ISource<T>): void;
}
export default interface ISource<T> {
    dequeue(): T | undefined;
}

// TODO is this still useful? the dequeue functions needed to have different names, so it does not work with the generic interface anymore.
export default interface ISource<T> {
    dequeue(): T | undefined;
}

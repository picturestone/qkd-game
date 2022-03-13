import ISource from "./ISource";

export default interface ISink<T> {
    enqueue(value: T): void;
}
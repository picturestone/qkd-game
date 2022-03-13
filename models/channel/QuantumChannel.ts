import Player from "../player/Player";
import Qbit from "../quantum/Qbit";
import Channel from "./Channel";

export default class QuantumChannel extends Channel<Qbit> {
    private qbitQueue: Qbit[];

    constructor() {
        super();
        this.qbitQueue = [];
    }

    dequeue(): Qbit | undefined {
        return this.qbitQueue.shift();
    }

    enqueue(value: Qbit): void {
        this.qbitQueue.push(value);
        super.notifyObservers();
    }
}
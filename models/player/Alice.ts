import ISink from "../channel/ISink";
import Qbit from "../quantum/Qbit";
import PlayerRole from "./PlayerRole";

export default class Alice extends PlayerRole {
    private _quantumChannel: ISink<Qbit>;
    // TODO add classical channel: ISource<confirmation> or something.

    constructor(quantumChannel: ISink<Qbit>) {
        super();
        this._quantumChannel = quantumChannel;
    }

    public sendQbit(qbit: Qbit) {
        this._quantumChannel.enqueue(qbit);
    }
}
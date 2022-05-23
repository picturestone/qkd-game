"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Randomizer_1 = __importDefault(require("../../helper/Randomizer"));
const Basis_1 = __importDefault(require("../quantum/Basis"));
const PlayerRole_1 = __importDefault(require("./PlayerRole"));
class Bob extends PlayerRole_1.default {
    // TODO add classical channel: ISink<confirmation> or something.
    constructor(quantumChannel) {
        super();
        this._quantumChannel = quantumChannel;
        this._quantumChannel.addObserver(this);
    }
    // Called when qbit is added to quantum channel.
    // TODO this function must be given to the role in the constructor because from here on the player cannot be notified
    onEnqueue(to) {
        const qbit = to.dequeue();
        const measuredPolarization = qbit === null || qbit === void 0 ? void 0 : qbit.measurePolarization(Randomizer_1.default.getRandomEnum(Basis_1.default));
        console.log(measuredPolarization);
    }
}
exports.default = Bob;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuantumChannel_1 = __importDefault(require("./channel/QuantumChannel"));
const AlicePlayer_1 = __importDefault(require("./player/AlicePlayer"));
const BobPlayer_1 = __importDefault(require("./player/BobPlayer"));
const BasisComparisonChannel_1 = __importDefault(require("./channel/BasisComparisonChannel"));
const QbitDiscardChannel_1 = __importDefault(require("./channel/QbitDiscardChannel"));
const EvePlayer_1 = __importDefault(require("./player/EvePlayer"));
const Game_1 = __importDefault(require("./Game"));
class GameFactory {
    static createAliceBobEveGame(noOfQbits, aliceController, bobController, eveController, id) {
        const aliceEveQuantumConnection = new QuantumChannel_1.default();
        const aliceEveBasisComparisonConnection = new BasisComparisonChannel_1.default();
        const aliceEveQbitDiscardConnection = new QbitDiscardChannel_1.default();
        const eveBobQuantumConnection = new QuantumChannel_1.default();
        const eveBobBasisComparisonConnection = new BasisComparisonChannel_1.default();
        const eveBobQbitDiscardConnection = new QbitDiscardChannel_1.default();
        const alicePlayer = new AlicePlayer_1.default(aliceController, aliceEveQuantumConnection, aliceEveBasisComparisonConnection, aliceEveQbitDiscardConnection);
        const evePlayer = new EvePlayer_1.default(eveController, aliceEveQuantumConnection, eveBobQuantumConnection, aliceEveBasisComparisonConnection, eveBobBasisComparisonConnection, eveBobQbitDiscardConnection, aliceEveQbitDiscardConnection);
        const bobPlayer = new BobPlayer_1.default(bobController, eveBobQuantumConnection, eveBobBasisComparisonConnection, eveBobQbitDiscardConnection);
        return new Game_1.default(noOfQbits, alicePlayer, bobPlayer, evePlayer, id);
    }
    static createAliceBobGame(noOfQbits, aliceController, bobController, id) {
        const aliceBobQuantumConnection = new QuantumChannel_1.default();
        const aliceBobBasisComparisonConnection = new BasisComparisonChannel_1.default();
        const aliceBobQbitDiscardConnection = new QbitDiscardChannel_1.default();
        const alicePlayer = new AlicePlayer_1.default(aliceController, aliceBobQuantumConnection, aliceBobBasisComparisonConnection, aliceBobQbitDiscardConnection);
        const bobPlayer = new BobPlayer_1.default(bobController, aliceBobQuantumConnection, aliceBobBasisComparisonConnection, aliceBobQbitDiscardConnection);
        return new Game_1.default(noOfQbits, alicePlayer, bobPlayer, undefined, id);
    }
}
exports.default = GameFactory;

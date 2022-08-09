import QuantumChannel from './channel/QuantumChannel';
import AliceController from './player/AliceController';
import AlicePlayer from './player/AlicePlayer';
import BobController from './player/BobController';
import BobPlayer from './player/BobPlayer';
import IGameJson from '../qkd-game-client/src/models/api/IGameJson';
import BasisComparisonChannel from './channel/BasisComparisonChannel';
import qbitDiscardChannel from './channel/QbitDiscardChannel';
import EveController from './player/EveController';
import EvePlayer from './player/EvePlayer';
import Game from './Game';

export default class GameFactory {
    public static createAliceBobEveGame(
        noOfQbits: number,
        aliceController: AliceController,
        bobController: BobController,
        eveController: EveController,
        id?: string
    ): Game {
        const aliceEveQuantumConnection = new QuantumChannel();
        const aliceEveBasisComparisonConnection = new BasisComparisonChannel();
        const aliceEveQbitDiscardConnection = new qbitDiscardChannel();
        const eveBobQuantumConnection = new QuantumChannel();
        const eveBobBasisComparisonConnection = new BasisComparisonChannel();
        const eveBobQbitDiscardConnection = new qbitDiscardChannel();
        const alicePlayer = new AlicePlayer(
            aliceController,
            aliceEveQuantumConnection,
            aliceEveBasisComparisonConnection,
            aliceEveQbitDiscardConnection
        );
        const evePlayer = new EvePlayer(
            eveController,
            aliceEveQuantumConnection,
            eveBobQuantumConnection,
            aliceEveBasisComparisonConnection,
            eveBobBasisComparisonConnection,
            eveBobQbitDiscardConnection,
            aliceEveQbitDiscardConnection
        );
        const bobPlayer = new BobPlayer(
            bobController,
            eveBobQuantumConnection,
            eveBobBasisComparisonConnection,
            eveBobQbitDiscardConnection
        );
        return new Game(noOfQbits, alicePlayer, bobPlayer, evePlayer, id);
    }

    public static createAliceBobGame(
        noOfQbits: number,
        aliceController: AliceController,
        bobController: BobController,
        id?: string
    ): Game {
        const aliceBobQuantumConnection = new QuantumChannel();
        const aliceBobBasisComparisonConnection = new BasisComparisonChannel();
        const aliceBobQbitDiscardConnection = new qbitDiscardChannel();
        const alicePlayer = new AlicePlayer(
            aliceController,
            aliceBobQuantumConnection,
            aliceBobBasisComparisonConnection,
            aliceBobQbitDiscardConnection
        );
        const bobPlayer = new BobPlayer(
            bobController,
            aliceBobQuantumConnection,
            aliceBobBasisComparisonConnection,
            aliceBobQbitDiscardConnection
        );
        return new Game(noOfQbits, alicePlayer, bobPlayer, undefined, id);
    }
}

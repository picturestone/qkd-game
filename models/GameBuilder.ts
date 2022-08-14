import QuantumChannel from './channel/QuantumChannel';
import AlicePlayer from './player/AlicePlayer';
import BobPlayer from './player/BobPlayer';
import BasisComparisonChannel from './channel/BasisComparisonChannel';
import qbitDiscardChannel from './channel/QbitDiscardChannel';
import EvePlayer from './player/EvePlayer';
import Game from './Game';
import IUser = Express.User;
import HumanAlicePlayer from './player/HumanAlicePlayer';
import ComputerAlicePlayer from './player/ComputerAlicePlayer';
import HumanEvePlayer from './player/HumanEvePlayer';
import ComputerEvePlayer from './player/ComputerEvePlayer';
import HumanBobPlayer from './player/HumanBobPlayer';
import ComputerBobPlayer from './player/ComputerBobPlayer';

// TODO this sounds more like the builder pattern than the factory pattern.
// See https://en.wikipedia.org/wiki/Software_design_pattern
export default class GameBuilder {
    public static createAliceBobEveGame(
        noOfQbits: number,
        aliceUser?: IUser,
        bobUser?: IUser,
        eveUser?: IUser,
        id?: string
    ): Game {
        const aliceEveQuantumConnection = new QuantumChannel();
        const aliceEveBasisComparisonConnection = new BasisComparisonChannel();
        const aliceEveQbitDiscardConnection = new qbitDiscardChannel();
        const eveBobQuantumConnection = new QuantumChannel();
        const eveBobBasisComparisonConnection = new BasisComparisonChannel();
        const eveBobQbitDiscardConnection = new qbitDiscardChannel();

        let alicePlayer: AlicePlayer;
        if (aliceUser) {
            alicePlayer = new HumanAlicePlayer(
                aliceEveQuantumConnection,
                aliceEveBasisComparisonConnection,
                aliceEveQbitDiscardConnection,
                aliceUser
            );
        } else {
            alicePlayer = new ComputerAlicePlayer(
                aliceEveQuantumConnection,
                aliceEveBasisComparisonConnection,
                aliceEveQbitDiscardConnection
            );
        }

        let evePlayer: EvePlayer;
        if (eveUser) {
            evePlayer = new HumanEvePlayer(
                aliceEveQuantumConnection,
                eveBobQuantumConnection,
                aliceEveBasisComparisonConnection,
                eveBobBasisComparisonConnection,
                eveBobQbitDiscardConnection,
                aliceEveQbitDiscardConnection,
                eveUser
            );
        } else {
            evePlayer = new ComputerEvePlayer(
                aliceEveQuantumConnection,
                eveBobQuantumConnection,
                aliceEveBasisComparisonConnection,
                eveBobBasisComparisonConnection,
                eveBobQbitDiscardConnection,
                aliceEveQbitDiscardConnection
            );
        }

        let bobPlayer: BobPlayer;
        if (bobUser) {
            bobPlayer = new HumanBobPlayer(
                eveBobQuantumConnection,
                eveBobBasisComparisonConnection,
                eveBobQbitDiscardConnection,
                bobUser
            );
        } else {
            bobPlayer = new ComputerBobPlayer(
                eveBobQuantumConnection,
                eveBobBasisComparisonConnection,
                eveBobQbitDiscardConnection
            );
        }

        const game = new Game(noOfQbits, alicePlayer, bobPlayer, evePlayer, id);
        return game;
    }

    public static createAliceBobGame(
        noOfQbits: number,
        aliceUser?: IUser,
        bobUser?: IUser,
        id?: string
    ): Game {
        const aliceBobQuantumConnection = new QuantumChannel();
        const aliceBobBasisComparisonConnection = new BasisComparisonChannel();
        const aliceBobQbitDiscardConnection = new qbitDiscardChannel();

        let alicePlayer: AlicePlayer;
        if (aliceUser) {
            alicePlayer = new HumanAlicePlayer(
                aliceBobQuantumConnection,
                aliceBobBasisComparisonConnection,
                aliceBobQbitDiscardConnection,
                aliceUser
            );
        } else {
            alicePlayer = new ComputerAlicePlayer(
                aliceBobQuantumConnection,
                aliceBobBasisComparisonConnection,
                aliceBobQbitDiscardConnection
            );
        }

        let bobPlayer: BobPlayer;
        if (bobUser) {
            bobPlayer = new HumanBobPlayer(
                aliceBobQuantumConnection,
                aliceBobBasisComparisonConnection,
                aliceBobQbitDiscardConnection,
                bobUser
            );
        } else {
            bobPlayer = new ComputerBobPlayer(
                aliceBobQuantumConnection,
                aliceBobBasisComparisonConnection,
                aliceBobQbitDiscardConnection
            );
        }

        const game = new Game(noOfQbits, alicePlayer, bobPlayer, undefined, id);
        return game;
    }
}

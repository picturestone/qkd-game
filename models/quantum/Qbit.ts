import Randomizer from '../../helper/Randomizer';
import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import IQbitJson from '../../qkd-game-client/src/models/api/IQbitJson';

export default class Qbit {
    private polarization: POLARIZATION;

    constructor(polarization: POLARIZATION) {
        this.polarization = polarization;
    }

    /**
     *
     * @param basis The basis in which the polarization should be measured.
     */
    measurePolarization(basis: BASIS): POLARIZATION {
        let pol = Randomizer.getRandomEnum(POLARIZATION);

        if (
            (this.polarization === POLARIZATION.MinusFourtyFive ||
                this.polarization === POLARIZATION.PlusFourtyFive) &&
            basis === BASIS.diagonal
        ) {
            pol = this.polarization;
        } else if (
            (this.polarization === POLARIZATION.Zero ||
                this.polarization === POLARIZATION.Ninety) &&
            basis === BASIS.horizontalVertical
        ) {
            pol = this.polarization;
        }

        return pol;
    }

    static fromJson(json: IQbitJson) {
        return new Qbit(json.polarization);
    }
}

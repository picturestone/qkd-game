import Randomizer from '../../helper/Randomizer';
import Basis from './Basis';
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
    measurePolarization(basis: Basis): POLARIZATION {
        let pol = Randomizer.getRandomEnum(POLARIZATION);

        if (
            (this.polarization === POLARIZATION.MinusFourtyFive ||
                this.polarization === POLARIZATION.PlusFourtyFive) &&
            basis === Basis.Diagonal
        ) {
            pol = this.polarization;
        } else if (
            (this.polarization === POLARIZATION.Zero ||
                this.polarization === POLARIZATION.Ninety) &&
            basis === Basis.HorizontalVertical
        ) {
            pol = this.polarization;
        }

        return pol;
    }

    static fromJson(json: IQbitJson) {
        return new Qbit(json.polarization);
    }
}

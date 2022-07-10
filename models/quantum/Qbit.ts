import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';
import IQbitJson from '../../qkd-game-client/src/models/api/IQbitJson';
import { PolarizationRandomizer } from './PolarizationRandomizer';

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
        let isBasisFittingPolarization = false;
        let pol: POLARIZATION;

        if (
            (this.polarization === POLARIZATION.MinusFourtyFive ||
                this.polarization === POLARIZATION.PlusFourtyFive) &&
            basis === BASIS.diagonal
        ) {
            isBasisFittingPolarization = true;
        } else if (
            (this.polarization === POLARIZATION.Zero ||
                this.polarization === POLARIZATION.Ninety) &&
            basis === BASIS.horizontalVertical
        ) {
            isBasisFittingPolarization = true;
        }

        if (isBasisFittingPolarization) {
            pol = this.polarization;
        } else {
            pol = new PolarizationRandomizer(basis).getRandomPolarization();
        }

        return pol;
    }

    static fromJson(json: IQbitJson) {
        return new Qbit(json.polarization);
    }
}

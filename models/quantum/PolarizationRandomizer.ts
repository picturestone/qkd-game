import Randomizer from '../../helper/Randomizer';
import BASIS from '../../qkd-game-client/src/models/api/Basis';
import POLARIZATION from '../../qkd-game-client/src/models/api/Polarization';

export class PolarizationRandomizer {
    private _forBasis: BASIS;

    constructor(forBasis: BASIS) {
        this._forBasis = forBasis;
    }

    getRandomPolarization(): POLARIZATION {
        const rnd = Randomizer.getRandomNumber(0, 1);
        let pol: POLARIZATION;

        if (this._forBasis === BASIS.diagonal) {
            if (rnd === 0) {
                pol = POLARIZATION.MinusFourtyFive;
            } else {
                pol = POLARIZATION.PlusFourtyFive;
            }
        } else {
            if (rnd === 0) {
                pol = POLARIZATION.Zero;
            } else {
                pol = POLARIZATION.Ninety;
            }
        }

        return pol;
    }
}

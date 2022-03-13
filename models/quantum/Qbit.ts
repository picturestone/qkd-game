import Randomizer from "../../helper/Randomizer";
import Basis from "./Basis";
import Polarization from "./Polarization";

export default class Qbit {
    private polarization: Polarization;

    constructor(polarization: Polarization) {
        this.polarization = polarization;
    }

    /**
     * 
     * @param basis The basis in which the polarization should be measured.
     */
    measurePolarization(basis: Basis): Polarization {
        let pol = Randomizer.getRandomEnum(Polarization);

        if((this.polarization === Polarization.MinusFourtyFive || this.polarization === Polarization.PlusFourtyFive) && basis === Basis.Diagonal) {
            pol = this.polarization;
        } else if ((this.polarization === Polarization.Zero || this.polarization === Polarization.Ninety) && basis === Basis.HorizontalVertical) {
            pol = this.polarization;
        }

        return pol;
    }
}
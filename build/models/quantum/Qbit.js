"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Randomizer_1 = __importDefault(require("../../helper/Randomizer"));
const Basis_1 = __importDefault(require("./Basis"));
const Polarization_1 = __importDefault(require("./Polarization"));
class Qbit {
    constructor(polarization) {
        this.polarization = polarization;
    }
    /**
     *
     * @param basis The basis in which the polarization should be measured.
     */
    measurePolarization(basis) {
        let pol = Randomizer_1.default.getRandomEnum(Polarization_1.default);
        if ((this.polarization === Polarization_1.default.MinusFourtyFive || this.polarization === Polarization_1.default.PlusFourtyFive) && basis === Basis_1.default.Diagonal) {
            pol = this.polarization;
        }
        else if ((this.polarization === Polarization_1.default.Zero || this.polarization === Polarization_1.default.Ninety) && basis === Basis_1.default.HorizontalVertical) {
            pol = this.polarization;
        }
        return pol;
    }
}
exports.default = Qbit;

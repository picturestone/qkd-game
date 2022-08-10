"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Basis_1 = __importDefault(require("../../qkd-game-client/src/models/api/Basis"));
const Polarization_1 = __importDefault(require("../../qkd-game-client/src/models/api/Polarization"));
const PolarizationRandomizer_1 = require("./PolarizationRandomizer");
class Qbit {
    constructor(polarization) {
        this.polarization = polarization;
    }
    /**
     *
     * @param basis The basis in which the polarization should be measured.
     */
    measurePolarization(basis) {
        let isBasisFittingPolarization = false;
        let pol;
        if ((this.polarization === Polarization_1.default.MinusFourtyFive ||
            this.polarization === Polarization_1.default.PlusFourtyFive) &&
            basis === Basis_1.default.diagonal) {
            isBasisFittingPolarization = true;
        }
        else if ((this.polarization === Polarization_1.default.Zero ||
            this.polarization === Polarization_1.default.Ninety) &&
            basis === Basis_1.default.horizontalVertical) {
            isBasisFittingPolarization = true;
        }
        if (isBasisFittingPolarization) {
            pol = this.polarization;
        }
        else {
            pol = new PolarizationRandomizer_1.PolarizationRandomizer(basis).getRandomPolarization();
        }
        return pol;
    }
    static fromJson(json) {
        return new Qbit(json.polarization);
    }
}
exports.default = Qbit;

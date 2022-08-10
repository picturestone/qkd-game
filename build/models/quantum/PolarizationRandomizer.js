"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarizationRandomizer = void 0;
const Randomizer_1 = __importDefault(require("../../helper/Randomizer"));
const Basis_1 = __importDefault(require("../../qkd-game-client/src/models/api/Basis"));
const Polarization_1 = __importDefault(require("../../qkd-game-client/src/models/api/Polarization"));
class PolarizationRandomizer {
    constructor(forBasis) {
        this._forBasis = forBasis;
    }
    getRandomPolarization() {
        const rnd = Randomizer_1.default.getRandomNumber(0, 1);
        let pol;
        if (this._forBasis === Basis_1.default.diagonal) {
            if (rnd === 0) {
                pol = Polarization_1.default.MinusFourtyFive;
            }
            else {
                pol = Polarization_1.default.PlusFourtyFive;
            }
        }
        else {
            if (rnd === 0) {
                pol = Polarization_1.default.Zero;
            }
            else {
                pol = Polarization_1.default.Ninety;
            }
        }
        return pol;
    }
}
exports.PolarizationRandomizer = PolarizationRandomizer;

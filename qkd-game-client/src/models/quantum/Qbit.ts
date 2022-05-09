import Polarization from "./Polarization";

export default class Qbit {
    private _polarization: Polarization;

    constructor(polarization: Polarization) {
        this._polarization = polarization;
    }

    public set polarization(polarization: Polarization) {
        this._polarization = polarization;
    }

    public get polarization() {
        return this._polarization;
    }
}
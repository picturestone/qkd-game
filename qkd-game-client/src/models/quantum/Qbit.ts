import IQbitJson from '../api/IQbitJson';
import POLARIZATION from '../api/Polarization';

export default class Qbit {
    private _polarization: POLARIZATION;

    constructor(polarization: POLARIZATION) {
        this._polarization = polarization;
    }

    public set polarization(polarization: POLARIZATION) {
        this._polarization = polarization;
    }

    public get polarization() {
        return this._polarization;
    }

    toJson(): IQbitJson {
        return {
            polarization: this._polarization,
        };
    }
}

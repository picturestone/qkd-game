import validator from 'validator';
import BASIS from '../qkd-game-client/src/models/api/Basis';
import IBasisComparisonData from '../qkd-game-client/src/models/api/IBasisComparisonData';
import ILobbyJson from '../qkd-game-client/src/models/api/ILobbyJson';
import IQbitDiscardData from '../qkd-game-client/src/models/api/IQbitDiscardedData';
import IQbitJson from '../qkd-game-client/src/models/api/IQbitJson';
import IUserJson from '../qkd-game-client/src/models/api/IUserJson';
import { PLAYERROLE } from '../qkd-game-client/src/models/api/PlayerRole';
import POLARIZATION from '../qkd-game-client/src/models/api/Polarization';

export default class Validator {
    isIdOrUndefined(id: string | undefined) {
        return id === undefined || this.isId(id);
    }

    isId(id: string) {
        return validator.isUUID(id, 4);
    }

    isName(name: string) {
        return validator.isLength(name, {
            min: 1,
            max: 127,
        });
    }

    isBoolean(boolean: boolean) {
        return validator.isBoolean(boolean + '');
    }

    isNumber(number: number) {
        return validator.isNumeric(number + '');
    }

    isBasis(basis: BASIS) {
        return Object.values(BASIS).includes(basis as BASIS);
    }

    isPolarization(polarization: POLARIZATION) {
        return Object.values(POLARIZATION).includes(
            polarization as POLARIZATION
        );
    }

    isPlayerrole(playerrole: PLAYERROLE) {
        return Object.values(PLAYERROLE).includes(playerrole as PLAYERROLE);
    }

    isCode(code: string) {
        return /^[01]+$/.test(code);
    }

    isIUserJson(userJson: IUserJson) {
        let isValid = true;

        if (isValid) {
            isValid = this.isIdOrUndefined(userJson.id);
        }
        if (isValid) {
            isValid = this.isName(userJson.name);
        }

        return isValid;
    }

    isIQbitDiscardData(qbitDiscardData: IQbitDiscardData) {
        let isValid = true;

        if (isValid) {
            isValid = this.isNumber(qbitDiscardData.qbitNo);
        }
        if (isValid) {
            isValid = this.isBoolean(qbitDiscardData.isDiscarded);
        }

        return isValid;
    }

    isIBasisComparisonData(basisComparisonData: IBasisComparisonData) {
        let isValid = true;

        if (isValid) {
            isValid = this.isNumber(basisComparisonData.qbitNo);
        }
        if (isValid) {
            isValid = this.isBasis(basisComparisonData.basis);
        }

        return isValid;
    }

    isIQbitJson(qbitJson: IQbitJson) {
        let isValid = true;

        if (isValid) {
            isValid = this.isPolarization(qbitJson.polarization);
        }

        return isValid;
    }

    isILobbyJson(lobbyJson: ILobbyJson) {
        let isValid = true;

        if (isValid) {
            isValid = this.isIdOrUndefined(lobbyJson.id);
        }
        if (isValid) {
            isValid = this.isBoolean(lobbyJson.isEveAllowed);
        }
        if (isValid) {
            isValid = this.isName(lobbyJson.name);
        }
        if (isValid) {
            isValid = this.isNumber(lobbyJson.noOfQbits);
        }
        if (isValid) {
            isValid = this.isIUserJson(lobbyJson.owner);
        }
        if (isValid && lobbyJson.reservedAlice !== undefined) {
            isValid = this.isIUserJson(lobbyJson.reservedAlice);
        }
        if (isValid && lobbyJson.reservedBob !== undefined) {
            isValid = this.isIUserJson(lobbyJson.reservedBob);
        }
        if (isValid && lobbyJson.reservedEve !== undefined) {
            isValid = this.isIUserJson(lobbyJson.reservedEve);
        }

        return isValid;
    }
}

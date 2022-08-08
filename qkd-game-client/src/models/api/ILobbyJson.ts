import IUserJson from './IUserJson';

export default interface ILobbyJson {
    name: string;
    owner: IUserJson;
    noOfQbits: number;
    isEveAllowed: boolean;
    id?: string;
    reservedAlice?: IUserJson;
    reservedBob?: IUserJson;
    reservedEve?: IUserJson;
}

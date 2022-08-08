import IUserJson from './IUserJson';

export default interface ILobbyJson {
    name: string;
    owner: IUserJson;
    noOfQbits: number;
    id?: string;
    reservedAlice?: IUserJson;
    reservedBob?: IUserJson;
}

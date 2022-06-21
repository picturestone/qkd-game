import IUserJson from './IUserJson';

export default interface ILobbyJson {
    name: string;
    owner: IUserJson;
    id?: string;
    reservedAlice?: IUserJson;
    reservedBob?: IUserJson;
}

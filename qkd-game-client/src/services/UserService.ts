import Auth from '../helper/Auth';
import IUserJson from '../models/api/IUserJson';
import User from '../models/User';
import apiService from './ApiService';

export default class UserService {
    private _resUrl = '/users';

    public get(id: string): Promise<User> {
        return apiService.get(`${this._resUrl}/${id}`).then((res) => {
            return this.jsonToModel(res.data);
        });
    }

    public create(user: User): Promise<string> {
        return apiService
            .post(this._resUrl, this.modelToJson(user))
            .then((res) => {
                new Auth().setToken(res.data);
                return res.data;
            });
    }

    private jsonToModel(json: IUserJson): User {
        return new User(json.name);
    }

    private modelToJson(model: User): IUserJson {
        return {
            name: model.name,
        };
    }
}

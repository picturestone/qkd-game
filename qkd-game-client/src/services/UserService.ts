import AuthStorage from '../helper/AuthStorage';
import User from '../models/User';
import apiService from './ApiService';

export default class UserService {
    private _resUrl = '/users';

    public get(id: string): Promise<User> {
        return apiService.get(`${this._resUrl}/${id}`).then((res) => {
            return User.fromJson(res.data);
        });
    }

    public create(user: User): Promise<string> {
        return apiService.post(this._resUrl, user.toJson()).then((res) => {
            new AuthStorage().setToken(res.data);
            return res.data;
        });
    }
}

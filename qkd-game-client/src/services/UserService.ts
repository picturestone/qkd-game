import IUserJson from "../models/api/IUserJson";
import User from "../models/User";

export default class UserService {
    private _baseUrl = '/api/users';

    public get(id: string): Promise<User> {
        return fetch(`${this._baseUrl}/${id}`)
            .then(data => {
                return data.json();
            }).then((data) => {
                return this.jsonToModel(data);
            }
        );
    }

    public create(user: User): Promise<string> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.modelToJson(user))
        };
        return fetch(this._baseUrl, requestOptions)
            .then(data => {
                return data.json();
            }).then((data) => {
                return data;
            }
        );
    }

    private jsonToModel(json: IUserJson): User {
        return new User(
            json.name
        );
    }

    private modelToJson(model: User): IUserJson {
        return {
            name: model.name
        };
    }
}

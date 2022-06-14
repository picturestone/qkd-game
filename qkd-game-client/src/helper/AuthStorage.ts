import jwtDecode from 'jwt-decode';
import IUserJson from '../models/api/IUserJson';
import User from '../models/User';

export default class AuthStorage {
    private _tokenKey = 'bearerToken';
    private _userKey = 'loggedInUser';

    setToken(token: string) {
        const decodedToken = jwtDecode<IUserJson>(token);
        localStorage.setItem(
            this._userKey,
            JSON.stringify(
                new User(decodedToken.name, decodedToken.id).toJson()
            )
        );
        localStorage.setItem(this._tokenKey, token);
    }

    getToken() {
        return localStorage.getItem(this._tokenKey);
    }

    getLoggedInUser(): User | null {
        let user = null;
        const localStorageEntry = localStorage.getItem(this._userKey);
        if (localStorageEntry) {
            user = User.fromJson(JSON.parse(localStorageEntry) as IUserJson);
        }
        return user;
    }
}

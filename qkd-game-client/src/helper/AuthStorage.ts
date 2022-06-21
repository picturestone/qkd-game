import jwtDecode from 'jwt-decode';
import IUserJson from '../models/api/IUserJson';
import User from '../models/User';

export default class AuthStorage {
    private _tokenKey = 'bearerToken';
    private _userKey = 'loggedInUser';

    setToken(token: string) {
        const decodedToken = jwtDecode<IUserJson>(token);
        sessionStorage.setItem(
            this._userKey,
            JSON.stringify(
                new User(decodedToken.name, decodedToken.id).toJson()
            )
        );
        sessionStorage.setItem(this._tokenKey, token);
    }

    getToken() {
        return sessionStorage.getItem(this._tokenKey);
    }

    getLoggedInUser(): User | null {
        let user = null;
        const sessionStorageEntry = sessionStorage.getItem(this._userKey);
        if (sessionStorageEntry) {
            user = User.fromJson(JSON.parse(sessionStorageEntry) as IUserJson);
        }
        return user;
    }
}

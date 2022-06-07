export default class Auth {
    private _tokenKey = 'bearerToken';

    setToken(token: string) {
        return localStorage.setItem(this._tokenKey, token);
    }

    getToken() {
        return localStorage.getItem(this._tokenKey);
    }
}

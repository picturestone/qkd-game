"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_AUTH_MIDDLEWARE = exports.generateAccessToken = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = require("jsonwebtoken");
const UserDb_1 = __importDefault(require("../database/UserDb"));
const Config_1 = require("../helper/Config");
const secret = Config_1.SECRET;
const issuer = 'qkd-game';
const audience = 'qkd-game';
const expiresIn = '1d';
const userDb = new UserDb_1.default();
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    issuer: issuer,
    audience: audience,
}, function (jwt_payload, done) {
    const jwtPayload = jwt_payload;
    userDb
        .findById(jwtPayload.id)
        .then((user) => {
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
        .catch((err) => {
        return done(err, false);
    });
}));
function generateAccessToken(user) {
    let signedToken = '';
    const id = user.id;
    if (id) {
        const jwtPayload = {
            name: user.name,
            id: id,
        };
        signedToken = (0, jsonwebtoken_1.sign)(jwtPayload, secret, {
            issuer: issuer,
            audience: audience,
            expiresIn: expiresIn,
        });
    }
    return signedToken;
}
exports.generateAccessToken = generateAccessToken;
exports.JWT_AUTH_MIDDLEWARE = passport_1.default.authenticate('jwt', {
    session: false,
});

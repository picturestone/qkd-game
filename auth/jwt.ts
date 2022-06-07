import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import UserDb from '../database/UserDb';

const secret = process.env.SECRET || 'VERY_SECRET_STRING';
const issuer = 'qkd-game';
const audience = 'qkd-game';
const expiresIn = '1d';
const userDb = new UserDb();

passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    issuer: issuer,
    audience: audience
}, function(jwt_payload, done) {
    userDb.findById(jwt_payload.id).then((user) => {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch((err) => {
        return done(err, false);
    });
}));

export function generateAccessToken(user: User) {
    return sign({name: user.name, id: user.getId()}, secret, {
        issuer: issuer,
        audience: audience,
        expiresIn: expiresIn
    });
}
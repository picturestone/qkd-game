import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import UserDb from '../database/UserDb';
import { SECRET } from '../helper/Config';

const secret = SECRET;
const issuer = 'qkd-game';
const audience = 'qkd-game';
const expiresIn = '1d';
const userDb = new UserDb();

interface IJwtPayload {
    name: string;
    id: string;
}

passport.use(
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            issuer: issuer,
            audience: audience,
        },
        function (jwt_payload, done) {
            const jwtPayload = jwt_payload as IJwtPayload;
            userDb
                .findById(jwtPayload.id)
                .then((user) => {
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
                .catch((err) => {
                    return done(err, false);
                });
        }
    )
);

export function generateAccessToken(user: User) {
    let signedToken = '';
    const id = user.id;
    if (id) {
        const jwtPayload: IJwtPayload = {
            name: user.name,
            id: id,
        };
        signedToken = sign(jwtPayload, secret, {
            issuer: issuer,
            audience: audience,
            expiresIn: expiresIn,
        });
    }

    return signedToken;
}

export const JWT_AUTH_MIDDLEWARE = passport.authenticate('jwt', {
    session: false,
});

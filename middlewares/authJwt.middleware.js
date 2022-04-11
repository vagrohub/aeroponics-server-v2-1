import mongoose from 'mongoose';
import JwtStrategy from 'passport-jwt/lib/strategy.js';
import ExtractJwt from 'passport-jwt/lib/extract_jwt.js';
import { secretKey } from '../app.config.js';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
};

const authJwt = (passport) => {
    passport.use(new JwtStrategy(options, async (payload, done) => {
        try {
            const User = mongoose.model('User');
            const user = await User.findById(payload.id);

            if (user) {
                return done(null, user);
            }

            return done(new Error('user does not exist'), false);
        } catch (error) {
            return done(error, false);
        }
    }));
};

export default authJwt;

import passport from 'passport';

const checkingAuthenticate = () =>
    passport.authenticate('jwt', { session: false });

export default checkingAuthenticate;

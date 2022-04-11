import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import execMessageFromError from '../../utils/execMessageFromError.utils.js';
import { bcryptSaltRounds, secretKey } from '../../app.config.js';
import User from '../../user/model/user.model.js';

const generateAccessToken = (id) => {
    return jwt.sign({ id }, secretKey)
};

const registration = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const condidate = await User.findOne({ email });

        if (condidate) {
            return res.status(400).send({ error: `User already registered` });
        }

        const user = new User({
            username,
            email,
            password: bcrypt.hashSync(password, bcryptSaltRounds)
        });

        await user.save();

        return res.send({ token: generateAccessToken(user._id) });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to register user')
        });
    }
};

const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'User not registered' });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(400).send({ error: 'Invalid password' });
        }

        return res.send({ token: generateAccessToken(user._id) });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to login')
        });
    }
};

export {
    registration,
    login
}
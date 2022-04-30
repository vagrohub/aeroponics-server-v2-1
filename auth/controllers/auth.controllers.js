import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import execMessageFromError from '../../utils/execMessageFromError.utils.js';
import generatePassword from '../../utils/generatePassword.js';
import {
    USER_IS_REGISTERED,
    FAILED_REGISTERED,
    USER_IS_NOT_REGISTERED,
    INVALID_PASSWORD,
    FAILED_LOGIN
} from '../../constants/error.constants.js';
import { bcryptSaltRounds, secretKey, gmailUser, gmailPass } from '../../app.config.js';
import User from '../../user/model/user.model.js';

const generateAccessToken = (id) => {
    return jwt.sign({ id }, secretKey)
};

const registration = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const condidate = await User.findOne({ email });

        if (condidate) {
            return res.status(400).send({ error: USER_IS_REGISTERED });
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
            error: execMessageFromError(error, FAILED_REGISTERED)
        });
    }
};

const login = async (req, res) => {
    try {
        console.log('new connect');
        const { password, email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: USER_IS_NOT_REGISTERED });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(400).send({ error: INVALID_PASSWORD });
        }

        return res.send({ token: generateAccessToken(user._id) });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, FAILED_LOGIN)
        });
    }
};

const recoveryPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        const newPassword = generatePassword(8);

        if (!user) {
            return res.status(400).send({ error: USER_IS_NOT_REGISTERED });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPass,
            },
        })
    
        await transporter.sendMail({
            from: '"Аэропоника" <vgshalabs@gmail.com>',
            to: email,
            subject: 'Новый пароль',
            text: `Ваш новый пароль: '${newPassword}'`
        })

        await user.edditPassword(bcrypt.hashSync(newPassword, bcryptSaltRounds))

        return res.send({ status: true })
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, FAILED_RECOVERY_PASSWORD)
        });
    }
}

export {
    registration,
    login,
    recoveryPassword
}
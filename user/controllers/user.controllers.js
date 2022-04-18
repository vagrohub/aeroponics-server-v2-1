import bcrypt from 'bcrypt';
import { bcryptSaltRounds } from '../../app.config.js';
import execMessageFromError from '../../utils/execMessageFromError.utils.js';
import {
    ERROR_SEREVER,
    FAILED_CHANGE_USER_PASSWORD,
    FAILED_CHANGE_USER_NAME
} from '../../constants/error.constants.js';

const getUserData = async (req, res) => {
    try {
        const user = await req.user;

        return res.send({
            user: {
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, ERROR_SEREVER)
        });
    }
};

const getFullUserData = async (req, res) => {
    try {
        const user = await req.user
            .populate({
                path: 'deviceList',
                model: 'Device',
                populate: [
                    {
                        path: 'currentExperiment',
                        model: 'Experiment'
                    },
                    {
                        path: 'cycles',
                        model: 'Experiment'
                    }
                ]
            })

        return res.send({
            user
        });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, ERROR_SEREVER)
        });
    }
};

const edditUserPassword = async (req, res) => {
    try {
        const user = req.user;

        await user.pushDevice(bcrypt.hashSync(
            req.body.password, bcryptSaltRounds
        ));

        return res.send({ status: true });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, FAILED_CHANGE_USER_PASSWORD)
        });
    }
};

const edditUsername = async () => {
    try {
        const user = req.user;

        await user.edditUsername(req.body.username);

        return res.send({ status: true });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, FAILED_CHANGE_USER_NAME)
        })
    }
};

export {
    edditUserPassword,
    edditUsername,
    getUserData,
    getFullUserData
};

import bcrypt from 'bcrypt';
import { bcryptSaltRounds } from '../../app.config.js';
import execMessageFromError from '../../utils/execMessageFromError.utils.js';

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
            error: execMessageFromError(error, 'Server error')
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
            error: execMessageFromError(error, 'Server error')
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
            error: execMessageFromError(error, 'Failed to change password')
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
            error: execMessageFromError(error, 'Failed to change username')
        })
    }
};

export {
    edditUserPassword,
    edditUsername,
    getUserData,
    getFullUserData
};

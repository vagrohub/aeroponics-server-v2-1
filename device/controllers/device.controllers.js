import Device from '../model/device.model.js';
import { bcryptSaltRounds } from '../../app.config.js';
import { createNewExperiment, excludeSensitiveData } from '../utils/controllers.utils.js';
import bcrypt from 'bcrypt';
import execMessageFromError from '../../utils/execMessageFromError.utils.js';

const getDeviceList = async (req, res) => {
    try {
        let { deviceList } = await req.user
            .populate([
                {
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
                }
            ]);

        deviceList = deviceList.map(device => {
            return excludeSensitiveData(device)
        });

        return res.send({ devices: deviceList });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to get device list')
        });
    }
};

const initNewDevice = async (req, res) => {
    try {
        let condidate = await Device.findOne({
            name: req.body.name
        });

        if (condidate) {
            return res.status(400).send({
                error: `A device named ${req.body.name} already exists`
            });
        }

        let id = await createNewExperiment();

        condidate = new Device({
            name: req.body.name,
            password: bcrypt.hashSync(
                req.body.password,
                bcryptSaltRounds
            ),
            description: req.body.description || '',
            currentExperiment: id
        });

        const user = req.user;
        await user.pushDevice(condidate.id);
        await condidate.save();

        return res.send({ status: true });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to create device')
        });
    }
};

const pushMeasurement = async (req, res) => {
    try {
        const device = await Device
            .findOne({
                name: req.body.name
            })
            .populate([{
                path: 'currentExperiment',
                model: 'Experiment'
            }]);

        if (!device) {
            return res.status(400).send({
                error: `Device is not init`
            });
        }

        if (!bcrypt.compareSync(req.body.password, device.password)) {
            return res.status(400).send({
                error: `Login and password do not match`
            });
        }

        for await (const measurement of req.body.measurements) {
            await device.currentExperiment.pushMeasurement(measurement);
        }
        await device.currentExperiment.assignLatestUpdate(req.body.date);

        return res.send({ status: true });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Data write error')
        });
    }
};

const stopCurrentExperiment = async (req, res) => {
    try {
        let { deviceList } = await req.user
            .populate([
                {
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
                }
            ]);
        const device = deviceList.find(device => device._id.toString() === req.body.id)

        if (!device) {
            return res.status(400).send({
                error: `Device is not init`
            });
        }

        const newId = await createNewExperiment(req.body.title, req.body.description);

        await device.stopCurrentExperiment(newId);
        return res.send({ status: true });
    } catch (error) {
        return res
            .status(503)
            .send({
                error: execMessageFromError(error, 'Failed to complete experiment')
            });
    }
};

const getDeviceDataById = async (req, res) => {
    try {
        let { deviceList } = await req.user
            .populate([
                {
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
                }
            ]);
        const device = deviceList.find(device => device._id.toString() === req.query.id)

        if (!device) {
            return res.status(400).send({
                error: `Device is not init`
            });
        }

        return res.send({
            device: excludeSensitiveData(device)
        });
    } catch {
        return res
            .status(503)
            .send({
                error: execMessageFromError(error, 'Error getting device')
            });
    }
};

const edditDescriptionDevice = async (req, res) => {
    try {
        let { deviceList } = await req.user
            .populate([
                {
                    path: 'deviceList',
                    model: 'Device'
                }
            ]);

        const device = deviceList.find(device => device._id.toString() === req.body.id);

        if (!device) {
            return res.status(400).send({
                error: `Device is not init`
            });
        }

        await device.edditDescription(req.body.description);
        return res.send({ status: true });
    } catch (error) {
        return res
            .status(503)
            .send({
                error: execMessageFromError(error, 'Description change error')
            });
    }
}

export {
    initNewDevice,
    pushMeasurement,
    stopCurrentExperiment,
    getDeviceDataById,
    edditDescriptionDevice,
    getDeviceList
}
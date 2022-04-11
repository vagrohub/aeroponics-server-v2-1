import Experiment from '../model/experiment.model.js';
import { experimentWithSpecifiedIdNotExist } from '../utils/controllers.utils.js';
import execMessageFromError from '../../utils/execMessageFromError.utils.js';

const getExperimentById = async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.query.id);

        if (!experiment) {
            return experimentWithSpecifiedIdNotExist(req, res);
        }

        return res.status(200).send({ experiment });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to get experiment')
        });
    }
};

const getExperimentListByDeviceId = async (req, res) => {
    try {
        let { deviceList } = await req.user
            .populate([{
                path: 'deviceList',
                model: 'Device'
            }]);

        let device = deviceList.find(device => device.name === req.query.name);
        device = await device.populate([
            {
                path: 'currentExperiment',
                model: 'Experiment'
            },
            {
                path: 'cycles',
                model: 'Experiment'
            }
        ]);

        const experimentsInCycle = device.cycles;
        const currentExperiment = device.currentExperiment;

        return res.send({
            experimentsInCycle,
            currentExperiment
        });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to get experiment')
        });
    }
};

const createNewExperiment = async (req, res) => {
    try {
        const experiment = new Experiment({
            title: req.body.title, description: req.body.description
        });
        await experiment.save();
        return res.status(200).send({ id: experiment._id });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to create experiment')
        })
    }
};

const edditTitleExperiment = async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.body.id);

        if (!experiment) {
            return experimentWithSpecifiedIdNotExist(req, res);
        }

        await experiment.edditTitle(req.body.title);
        return res.status(200).send({ status: true });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to change title')
        });
    }
};

const edditDescriptionExperiment = async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.body.id);

        if (!experiment) {
            return experimentWithSpecifiedIdNotExist(req, res);
        }

        await experiment.edditDescription(req.body.description);
        return res.status(200).send({ status: true });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Could not change description')
        });
    }
};

const pushMeasurementExperiment = async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.body.id);

        if (!experiment) {
            return experimentWithSpecifiedIdNotExist(req, res);
        }

        await experiment.pushMeasurement(req.body.measurement);
        return res.status(200).send({ experiment });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, 'Failed to record measurements')
        });
    }
};

export {
    getExperimentById,
    createNewExperiment,
    edditTitleExperiment,
    edditDescriptionExperiment,
    pushMeasurementExperiment,
    getExperimentListByDeviceId
}
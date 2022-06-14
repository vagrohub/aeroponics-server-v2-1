import Experiment from '../model/experiment.model.js';
import { experimentWithSpecifiedIdNotExist } from '../utils/controllers.utils.js';
import execMessageFromError from '../../utils/execMessageFromError.utils.js';
import {
    FAILED_GET_EXP,
    FAILED_CREATE_EXP,
    FAILED_EDDIT_EXP_TITLE,
    FAILED_EDDIT_EXP_DESCRIPTION,
    FAILED_RECORD_MEASUREMENTS,
} from '../../constants/error.constants.js';
import xlsxBuild from '../utils/xlsxBuild.js';

const getExperimentById = async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.query.id);

        if (!experiment) {
            return experimentWithSpecifiedIdNotExist(req, res);
        }

        return res.status(200).send({ experiment });
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, FAILED_GET_EXP)
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
            error: execMessageFromError(error, FAILED_GET_EXP)
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
            error: execMessageFromError(error, FAILED_CREATE_EXP)
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
            error: execMessageFromError(error, FAILED_EDDIT_EXP_TITLE)
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
            error: execMessageFromError(error, FAILED_EDDIT_EXP_DESCRIPTION)
        });
    }
};

const getExcelBuffer = async (req, res) => {
    try {
        const experiment = await Experiment.findById(req.query.id);

        if (!experiment) {
            return experimentWithSpecifiedIdNotExist(req, res);
        }

        res.set('Content-Type', 'multipart/form-data');
        return res.status(200).send(xlsxBuild(experiment));
    } catch (error) {
        return res.status(503).send({
            error: execMessageFromError(error, FAILED_GET_EXP)
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
            error: execMessageFromError(error, FAILED_RECORD_MEASUREMENTS)
        });
    }
};

export {
    getExperimentById,
    createNewExperiment,
    edditTitleExperiment,
    edditDescriptionExperiment,
    pushMeasurementExperiment,
    getExperimentListByDeviceId,
    getExcelBuffer
}

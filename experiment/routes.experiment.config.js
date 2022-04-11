import { Router } from 'express';
import checkingRequestsForFields from '../middlewares/checkingRequestsForFields.middleware.js';
import checkingAuthenticate from '../middlewares/checkingAuthenticate.middleware.js';
import {
    getExperimentById,
    createNewExperiment,
    edditTitleExperiment,
    edditDescriptionExperiment,
    pushMeasurementExperiment,
    getExperimentListByDeviceId
} from './controllers/experiment.controllers.js';


const router = Router();


// Получить эксперимент по индифиатору
router.get(
    '/',
    [
        checkingRequestsForFields('query', 'id')
    ],
    getExperimentById
);

// Получить список экспериментов устройства по имени
router.get(
    '/list',
    [
        checkingAuthenticate(),
        checkingRequestsForFields('query', 'name')
    ],
    getExperimentListByDeviceId
);

// Создать новый экспреимент
router.post(
    '/new',
    [
        checkingRequestsForFields('body', 'title', 'description')
    ],
    createNewExperiment
);

// Добавить измерения в текущий экспримент
router.patch(
    '/measurement',
    [
        checkingRequestsForFields('body', 'id', 'measurement')
    ],
    pushMeasurementExperiment
);

// Изменить название эксперимента
router.patch(
    '/title',
    [
        checkingAuthenticate(),
        checkingRequestsForFields('body', 'id', 'title')
    ],
    edditTitleExperiment
);

// Изменить описание эксперимента
router.patch(
    '/description',
    [
        checkingAuthenticate(),
        checkingRequestsForFields('body', 'id', 'description')
    ],
    edditDescriptionExperiment
);

export default router;
import { Router } from 'express';
import {
    initNewDevice,
    pushMeasurement,
    stopCurrentExperiment,
    getDeviceDataById,
    edditDescriptionDevice,
    getDeviceList
} from './controllers/device.controllers.js';
import checkingRequestsForFields from '../middlewares/checkingRequestsForFields.middleware.js';
import checkingAuthenticate from '../middlewares/checkingAuthenticate.middleware.js';

const router = new Router();

// Получить устройство по индификатору
router.get(
    '/', 
    [
        checkingAuthenticate(),
        checkingRequestsForFields('query', 'id')
    ],
    getDeviceDataById
);

// Получить список всех устройств 
router.get(
    '/list', 
    [
        checkingAuthenticate(),
    ],
    getDeviceList
);

// Инициализировать новое устройтсво
router.post(
    '/new',
    [
        checkingAuthenticate(),
        checkingRequestsForFields('body', 'name', 'password', 'description')
    ],
    initNewDevice
);

// Завершить текущий эксперимент и начать новый
router.post(
    '/experiment',
    [
        checkingAuthenticate(),
        checkingRequestsForFields('body', 'id', 'title', 'description')
    ],
    stopCurrentExperiment
);

// Изменить описание эксперимента
router.patch(
    '/description',
    [
        checkingAuthenticate(),
        checkingRequestsForFields('body', 'id', 'description')
    ],
    edditDescriptionDevice
);


// Только для устройсва
// Добавить измерения в текущий экспримент
router.post(
    '/experiment-push',
    [
        checkingRequestsForFields('body', 'name', 'password', 'measurements', 'date')
    ],
    pushMeasurement
);

export default router;

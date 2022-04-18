import { Router } from 'express';
import { login, registration, recoveryPassword } from './controllers/auth.controllers.js';
import checkingRequestsForFields from '../middlewares/checkingRequestsForFields.middleware.js';

const router = new Router();

router.post(
    '/registration',
    [
        checkingRequestsForFields('body', 'email', 'username', 'password')
    ],
    registration
);

router.post(
    '/login',
    [
        checkingRequestsForFields('body', 'email', 'password')
    ],
    login
);
router.post(
    '/recovery',
    [
        checkingRequestsForFields('body', 'email')
    ],
    recoveryPassword
);

export default router
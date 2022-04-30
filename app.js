import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import authJwt from './middlewares/authJwt.middleware.js';
import experimentRoutes from './experiment/routes.experiment.config.js';
import deviceRoutes from './device/routes.device.config.js';
import authRoutes from './auth/routes.auth.config.js';
import userRoutes from './user/routes.user.config.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(passport.initialize());
authJwt(passport);

app.use('/auth', authRoutes)
app.use('/experiment', experimentRoutes);
app.use('/device', deviceRoutes);
app.use('/user', userRoutes);

const start = async () => {
    try {
        await mongoose.connect(
            'mongodb://127.0.0.1:27017/aeroponics'
        );
        app.listen(
            3000,
            () => {
                console.log('server started');
            }
        );
    } catch (err) {
        console.log(err);
    }
};

start();

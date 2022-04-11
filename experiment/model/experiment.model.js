import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const experimentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    measurements: [{
        danger: Boolean,
        tempRoom: Number,
        tempWater: Number,
        lightSensor: Number,
        lightWorkingTime: Number,
        lightOffTime: Date,
        pumpTime: Number,
        pumpSleep: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

experimentSchema.methods.pushMeasurement = async function (measurement) {
    this.measurements.push(measurement);
    await this.save();
};

experimentSchema.methods.assignLatestUpdate = async function (lastUpdate) {
    this.lastUpdate = lastUpdate;
    await this.save();
};

experimentSchema.methods.edditTitle = async function (title) {
    this.title = title;
    await this.save();
};

experimentSchema.methods.edditDescription = async function (description) {
    this.description = description;
    await this.save();
};

const Experiment = model('Experiment', experimentSchema);

export default Experiment;

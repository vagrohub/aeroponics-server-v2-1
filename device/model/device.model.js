import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const deviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cycles: [{
        type: Schema.Types.ObjectId,
        ref: 'Experiment'
    }],
    currentExperiment: {
        type: Schema.Types.ObjectId,
        ref: 'Experiment'
    }
});

deviceSchema.methods.stopCurrentExperiment = async function(idNewExperiment) {
    this.cycles = this.cycles ?
        [...this.cycles, this.currentExperiment] :
        [this.currentExperiment];
    this.currentExperiment = idNewExperiment;
    await this.save();
};

deviceSchema.methods.edditDescription = async function(description) {
    this.description = description;
    await this.save();
};

const Device = model('Device', deviceSchema);

export default Device;

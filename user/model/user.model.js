import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    deviceList: [{
        type: Schema.Types.ObjectId,
        ref: 'Device'
    }]
});

userSchema.methods.edditPassword = async function(hashPassword) {
    this.password = hashPassword;
    await this.save();
};

userSchema.methods.edditUsername = async function(username) {
    this.name = username;
    await this.save();
};

userSchema.methods.pushDevice = async function(deviceId) {
    this.deviceList.push(deviceId);
    await this.save();
};

const User = model('User', userSchema);

export default User;

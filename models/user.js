const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema =
    new Schema({
        fullName: String,
        username: { type: String, required: true },
        password: { type: String, required: true },
        isMember: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false }
    });

const User = mongoose.model('User', UserSchema);

module.exports = User;
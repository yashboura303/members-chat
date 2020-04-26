const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema =
    new Schema({
        title: { type: String, required: true },
        message: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now }
    });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
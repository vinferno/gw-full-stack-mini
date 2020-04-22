const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatSchema = new Schema(
    {
        message: {type: String, required: true},
        sender: { type : mongoose.Schema.Types.ObjectId, ref: 'User' },
        participants: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
    }
);

module.exports = mongoose.model('Chat', ChatSchema);

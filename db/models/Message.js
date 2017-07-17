const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    from: String,
    to: String,
    date: String
});

const Message = mongoose.model('Message', messageSchema );

module.exports = Message;

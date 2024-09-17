const mongoose = require('mongoose');

const token = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    cevap: { type: String, required: false }
});

const tokenUsed = mongoose.model('TokenBalance', token);

module.exports = tokenUsed;

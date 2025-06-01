// models/LastCode.js
const mongoose = require('mongoose');

const lastCodeSchema = new mongoose.Schema({
  lastCode: {
    type: String,
    required: true,
    default: '000A'
  }
});

const LastCode = mongoose.model('LastCode', lastCodeSchema);
module.exports = LastCode;

const mongoose = require('mongoose');

const SuperadminSchema = new mongoose.Schema({
    status: { type: String,  enum: ['active','inactive'], default:'active' },
    name: String,
    email: String,
    password: String,
    photo: String
})

module.exports = mongoose.model('Superadmin', SuperadminSchema);
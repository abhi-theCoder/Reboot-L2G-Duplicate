const mongoose = require('mongoose');

const grievancePolicySchema = new mongoose.Schema({
  title: { type: String, required: true },
  sections: [
    {
      heading: { type: String, required: true },
      content: { type: String, required: true }
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GrievancePolicy', grievancePolicySchema);
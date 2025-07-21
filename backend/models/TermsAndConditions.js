const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true } // Stores the full HTML content of the section
});

const termsAndConditionsSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  introText: { type: String }, // Can be HTML from RTE
  sections: [sectionSchema], // Array of sections
  footerText: { type: String }, // Can be HTML from RTE
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TermsAndConditions', termsAndConditionsSchema);
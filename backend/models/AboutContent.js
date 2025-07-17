const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  // Fixed ID to ensure only one document exists
  _id: {
    type: String,
    default: 'mainAboutDoc'
  },
  heading: {
    type: String,
    required: true,
    default: 'About L2G'
  },
  paragraph1: { // First paragraph of the about section
    type: String,
    required: true,
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...'
  },
  paragraph2: { // Second paragraph
    type: String,
    required: true,
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...'
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Pre-save hook to ensure only one document with _id 'mainAboutDoc'
aboutContentSchema.pre('save', async function(next) {
  if (this.isNew && this._id !== 'mainAboutDoc') {
    this._id = 'mainAboutDoc';
  }
  next();
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);
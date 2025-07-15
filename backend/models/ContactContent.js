const mongoose = require('mongoose');

const contactContentSchema = new mongoose.Schema({
  // Unique identifier for the single contact content document
  // We'll ensure only one document exists in the collection
  _id: {
    type: String,
    default: 'mainContactDoc' // A fixed ID to ensure only one document
  },
  heading: {
    type: String,
    required: true,
    default: 'Get In Touch'
  },
  paragraph: {
    type: String,
    required: true,
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut tempor ipsum dolor sit amet. labore'
  },
  address: {
    type: String,
    required: true,
    default: 'Plaza X, XY Floor, Street, XYZ'
  },
  email: {
    type: String,
    required: true,
    default: 'admin@gmail.com'
  },
  phone: {
    type: String,
    required: true,
    default: '+123-456-7890'
  },
  facebookUrl: {
    type: String,
    default: 'https://facebook.com'
  },
  twitterUrl: {
    type: String,
    default: 'https://twitter.com'
  },
  linkedinUrl: {
    type: String,
    default: 'https://linkedin.com'
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Pre-save hook to ensure only one document with _id 'mainContactDoc'
contactContentSchema.pre('save', async function(next) {
  if (this.isNew && this._id !== 'mainContactDoc') {
    // If a new document is being created and its _id is not 'mainContactDoc',
    // prevent saving or change its _id to 'mainContactDoc'
    this._id = 'mainContactDoc';
  }
  next();
});

module.exports = mongoose.model('ContactContent', contactContentSchema);

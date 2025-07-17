const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 10
  },
  category: {
    type: String,
    enum: ['medical', 'wellness', 'travel'], // Ensure these match your frontend dropdown values
    required: true
  },
  type: {
    type: String,
    enum: ['medical', 'wellness', 'travel']
  },
  location: {
    type: String,
    required: true,
    minlength: 3
  },
  excerpt: {
    type: String,
    required: true,
    minlength: 50
  },
  content: {
    type: String,
    required: true,
    minlength: 100
  },
  image: { // This will now store the Base64 string directly
    type: String,
    // You could set a default base64 image if you want, e.g., 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' (1x1 transparent pixel)
  },
  cost: {
    type: String
  },
  author: {
    type: String
  },
  authorTitle: {
    type: String
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  pros: {
    type: [String]
  },
  cons: {
    type: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
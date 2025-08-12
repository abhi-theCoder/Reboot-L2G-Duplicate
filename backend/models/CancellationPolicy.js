const mongoose = require('mongoose');

const cancellationPolicySchema = new mongoose.Schema({
  title: { type: String, required: true },
  introText: { type: String }, // For the initial paragraph
  sections: [
    {
      heading: { type: String, required: true },
      type: { type: String, enum: ['paragraph', 'table'], required: true }, // To distinguish content type
      content: { type: String }, // For paragraph type
      tableData: {
        headers: [{ type: String }],
        rows: [[{ type: String }]] // Array of arrays for table rows
      }
    }
  ],
  footerNotes: [{ type: String }], // For the small notes at the bottom
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CancellationPolicy', cancellationPolicySchema);
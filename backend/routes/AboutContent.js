const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent'); // Adjust path as needed
const authenticateSuperAdmin = require('../middleware/authSuperadminMiddleware'); // Assuming you have this middleware

router.get('/', async (req, res) => {
  try {
    // Attempt to find the single about content document by its fixed _id
    let content = await AboutContent.findById('mainAboutDoc');

    if (!content) {
      // If no document exists, create a default one
      content = new AboutContent({ _id: 'mainAboutDoc' }); // Schema defaults will apply
      await content.save();
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/', authenticateSuperAdmin, async (req, res) => {
  const { heading, paragraph1, paragraph2, imageUrl } = req.body;

  // Build content fields object to update
  const contentFields = {};
  if (heading) contentFields.heading = heading;
  if (paragraph1) contentFields.paragraph1 = paragraph1;
  if (paragraph2) contentFields.paragraph2 = paragraph2;
  if (imageUrl) contentFields.imageUrl = imageUrl;

  try {
    // Find the document by _id and update it.
    // { new: true } returns the updated document.
    // { upsert: true } creates the document if it doesn't exist (useful for first save).
    let content = await AboutContent.findByIdAndUpdate(
      'mainAboutDoc', // Fixed ID
      { $set: contentFields }, // Use $set to update specific fields
      { new: true, upsert: true, runValidators: true } // Return new doc, create if not exists, run schema validators
    );
    res.json(content);
  } catch (err) {
    console.error(err);
    // Handle validation errors or other Mongoose errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
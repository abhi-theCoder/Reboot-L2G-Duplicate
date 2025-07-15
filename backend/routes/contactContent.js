const express = require('express');
const router = express.Router();
const ContactContent = require('../models/ContactContent'); // Adjust path as needed
const authenticateSuperAdmin = require('../middleware/authSuperadminMiddleware');
const authenticate = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    console.log("hit")
  try {
    // Attempt to find the single contact content document by its fixed _id
    let content = await ContactContent.findById('mainContactDoc');

    if (!content) {
      // If no document exists, create a default one
      content = new ContactContent({ _id: 'mainContactDoc' }); // The schema's default values will apply
      await content.save();
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/', authenticateSuperAdmin, async (req, res) => {
//   console.log("hit")
  const { heading, paragraph, address, email, phone, facebookUrl, twitterUrl, linkedinUrl } = req.body;

  // Build content fields object
  const contentFields = {};
  if (heading) contentFields.heading = heading;
  if (paragraph) contentFields.paragraph = paragraph;
  if (address) contentFields.address = address;
  if (email) contentFields.email = email;
  if (phone) contentFields.phone = phone;
  if (facebookUrl) contentFields.facebookUrl = facebookUrl;
  if (twitterUrl) contentFields.twitterUrl = twitterUrl;
  if (linkedinUrl) contentFields.linkedinUrl = linkedinUrl;

  try {
    // Find the document by _id and update it.
    // { new: true } returns the updated document.
    // { upsert: true } creates the document if it doesn't exist.
    let content = await ContactContent.findByIdAndUpdate(
      'mainContactDoc', // Fixed ID
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

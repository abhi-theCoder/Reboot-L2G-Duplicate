const express = require('express');
const router = express.Router();
const TermsAndConditions = require('../models/TermsAndConditions'); // Adjust path as needed

// GET current terms and conditions
router.get('/', async (req, res) => {
  try {
    const terms = await TermsAndConditions.findOne().sort({ createdAt: -1 }); // Get the latest one
    if (!terms) {
      return res.status(404).json({ message: 'No terms and conditions found.' });
    }
    res.json(terms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error when fetching terms and conditions.' });
  }
});

// POST new terms and conditions (or initially create if none exists)
router.post('/', async (req, res) => {
  try {
    const newTerms = new TermsAndConditions(req.body);
    await newTerms.save();
    res.status(201).json(newTerms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error when creating terms and conditions.' });
  }
});

// PATCH (update) existing terms and conditions
router.patch('/:id', async (req, res) => {
  try {
    const updatedTerms = await TermsAndConditions.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated doc, run schema validators
    );
    if (!updatedTerms) {
      return res.status(404).json({ message: 'Terms and conditions document not found.' });
    }
    res.json(updatedTerms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error when updating terms and conditions.' });
  }
});

module.exports = router;
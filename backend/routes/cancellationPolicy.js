const express = require('express');
const router = express.Router();
const CancellationPolicy = require('../models/CancellationPolicy');

// GET cancellation policy
router.get('/', async (req, res) => {
  try {
    const policies = await CancellationPolicy.find({});
    if (policies.length === 0) {
      return res.status(404).json({ message: 'No cancellation policy found.' });
    }
    res.status(200).json(policies[0]); // Assuming you'll primarily fetch the first/only policy
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new cancellation policy (typically only done once or by admin)
router.post('/', async (req, res) => {
  const policy = new CancellationPolicy({
    title: req.body.title,
    introText: req.body.introText,
    sections: req.body.sections,
    footerNotes: req.body.footerNotes
  });

  try {
    const newPolicy = await policy.save();
    res.status(201).json(newPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH to update an existing cancellation policy
router.patch('/:id', async (req, res) => {
  try {
    const policy = await CancellationPolicy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Cancellation policy not found.' });
    }

    if (req.body.title != null) {
      policy.title = req.body.title;
    }
    if (req.body.introText != null) {
        policy.introText = req.body.introText;
    }
    if (req.body.sections != null) {
      policy.sections = req.body.sections;
    }
    if (req.body.footerNotes != null) {
      policy.footerNotes = req.body.footerNotes;
    }
    policy.lastUpdated = Date.now();

    const updatedPolicy = await policy.save();
    res.status(200).json(updatedPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
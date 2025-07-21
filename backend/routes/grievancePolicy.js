const express = require('express');
const router = express.Router();
const GrievancePolicy = require('../models/GrievancePolicy');

// GET all grievance policies (you might only have one, but this is flexible)
router.get('/', async (req, res) => {
    console.log("object")
  try {
    const policies = await GrievancePolicy.find({});
    if (policies.length === 0) {
      return res.status(404).json({ message: 'No grievance policy found.' });
    }
    res.status(200).json(policies[0]); // Assuming you'll primarily fetch the first/only policy
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new grievance policy (typically only done once or by admin)
router.post('/', async (req, res) => {
  const policy = new GrievancePolicy({
    title: req.body.title,
    sections: req.body.sections
  });

  try {
    const newPolicy = await policy.save();
    res.status(201).json(newPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH to update an existing grievance policy
router.patch('/:id', async (req, res) => {
  try {
    const policy = await GrievancePolicy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Grievance policy not found.' });
    }

    if (req.body.title != null) {
      policy.title = req.body.title;
    }
    if (req.body.sections != null) {
      policy.sections = req.body.sections;
    }
    policy.lastUpdated = Date.now(); // Update timestamp on change

    const updatedPolicy = await policy.save();
    res.status(200).json(updatedPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
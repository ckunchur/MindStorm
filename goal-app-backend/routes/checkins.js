// routes/checkins.js
const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');

// Get all check-ins for a user
router.get('/:userId', async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ userId: req.params.userId });
    res.json(checkIns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new check-in
router.post('/', async (req, res) => {
  const checkIn = new CheckIn({
    userId: req.body.userId,
    chatHistory: req.body.chatHistory,
    summary: req.body.summary
  });

  try {
    const newCheckIn = await checkIn.save();
    res.status(201).json(newCheckIn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
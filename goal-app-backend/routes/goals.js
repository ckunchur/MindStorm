const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Win = require('../models/Win');

// Get all goals
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  const goal = new Goal({
    title: req.body.title,
    description: req.body.description,
    targetDate: req.body.targetDate
  });

  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a goal
router.patch('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (req.body.title) goal.title = req.body.title;
    if (req.body.description) goal.description = req.body.description;
    if (req.body.targetDate) goal.targetDate = req.body.targetDate;
    goal.updatedAt = Date.now();

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a win to a goal
router.post('/:id/wins', async (req, res) => {
  const win = new Win({
    description: req.body.description,
    date: req.body.date,
    goalId: req.params.id
  });

  try {
    const newWin = await win.save();
    res.status(201).json(newWin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get wins for a goal
router.get('/:id/wins', async (req, res) => {
  try {
    const wins = await Win.find({ goalId: req.params.id });
    res.json(wins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

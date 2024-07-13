const mongoose = require('mongoose');

const WinSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }
});

module.exports = mongoose.model('Win', WinSchema);

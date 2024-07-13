// models/CheckIn.js
const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  chatHistory: { type: Array, default: [] },
  summary: { type: String, default: '' }
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
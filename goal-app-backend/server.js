// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Import routes
const userRoutes = require('./routes/users');
const goalRoutes = require('./routes/goals');
const checkInRoutes = require('./routes/checkins');

app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/checkins', checkInRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

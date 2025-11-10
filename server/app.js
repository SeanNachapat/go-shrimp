const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 3000;
const Farmer = require('../models/farmer.model');
const Farm = require('../models/farm.model');
const Pond = require('../models/pond.model');

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  appName: 'GoShrimp'
};

app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong!');
});

app.post('/api/farmer', async (req, res) => {
    try {
        const farmer = await Farmer.create(req.body);
        res.status(200).json(farmer);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri, mongoOptions)
  .then(() => {
    console.log("Connected to database!");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});
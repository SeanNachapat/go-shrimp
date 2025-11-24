const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const LineStrategy = require('passport-line').Strategy;

const app = express();
const port = process.env.PORT || 4000;
const Farmer = require('../models/farmer.model');
const Farm = require('../models/farm.model');
const Pond = require('../models/pond.model');
const StockingCycle = require('../models/stockingCycle.model');
const DailyReading = require('../models/dailyReading.model')

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  appName: 'GoShrimp'
};

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.LINE_CHANNEL_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Farmer.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new LineStrategy({
  channelID: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  callbackURL: `http://localhost:${port}/auth/line/callback`
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await Farmer.findOne({ lineId: profile.id });
      if (!user) {
        user = await Farmer.create({
          lineId: profile.id,
          fullName: profile.displayName,
          username: profile.displayName,
          picture: profile.pictureUrl,
          role: 'farmer'
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

app.get('/ping', (req, res) => {
  res.send('pong!');
});

app.get('/auth/line', passport.authenticate('line'));

app.get('/auth/line/callback',
  passport.authenticate('line', { failureRedirect: 'http://localhost:3000/login?error=login_failed' }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return res.status(500).json({ message: 'Logout failed' }); }
    res.status(200).json({ message: 'Logged out' });
  });
});

app.post('/api/farmer', async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

app.post('/api/farm/new', async (req, res) => {
  try {
    const farm = new Farm(req.body);
    await farm.save();
    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: farm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

app.post('/api/pond/new', async (req, res) => {
  try {
    const pond = await Pond.create(req.body);
    res.status(200).json(pond);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

app.post('/api/record/new', async (req, res) => {
  try {
    const dailyReading = await DailyReading.create(req.body);
    res.status(200).json(dailyReading);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

app.post('/api/stock/new', async (req, res) => {
  try {
    const stockingCycle = await StockingCycle.create(req.body);
    res.status(200).json(stockingCycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
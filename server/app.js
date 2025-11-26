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
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const farm = new Farm({ ...req.body, farmerId: req.user.id });
    await farm.save();

    // Update the creator to be linked to this farm
    const user = await Farmer.findById(req.user.id);
    user.farmId = farm._id;
    await user.save();

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

app.get('/api/ponds', async (req, res) => {
  try {
    const ponds = await Pond.find({});
    res.status(200).json(ponds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/pond/:pondId/active-cycle', async (req, res) => {
  try {
    const { pondId } = req.params;
    const cycle = await StockingCycle.findOne({
      pondId: pondId,
      cycleStatus: 'active'
    });
    if (!cycle) {
      return res.status(404).json({ message: 'No active cycle found' });
    }
    res.status(200).json(cycle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/records', async (req, res) => {
  try {
    const records = await DailyReading.find({})
      .sort({ readingDatetime: -1 })
      .limit(50)
      .populate('pondId', 'pondName')
      .populate('recordedBy', 'username fullName');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/farms', async (req, res) => {
  try {
    const farms = await Farm.find({});
    res.status(200).json(farms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/my-farm', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const user = await Farmer.findById(req.user.id);

    // Check if user is part of a farm
    if (user.farmId) {
      const farm = await Farm.findById(user.farmId);
      if (farm) {
        // Check if user is the owner
        const isOwner = farm.farmerId.toString() === user._id.toString();
        return res.status(200).json({ farm, role: isOwner ? 'owner' : 'employee' });
      }
    }

    // Fallback/Self-heal
    const ownedFarm = await Farm.findOne({ farmerId: req.user.id });
    if (ownedFarm) {
      user.farmId = ownedFarm._id;
      await user.save();
      return res.status(200).json({ farm: ownedFarm, role: 'owner' });
    }

    res.status(404).json({ message: 'No farm found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/farm/join', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const { farmId } = req.body;
    const farm = await Farm.findById(farmId);
    if (!farm) return res.status(404).json({ message: 'Farm not found' });

    const user = await Farmer.findById(req.user.id);
    user.farmId = farm._id;
    await user.save();

    res.status(200).json({ message: 'Joined farm successfully', farm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/farm/members', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const user = await Farmer.findById(req.user.id);
    let farmId = user.farmId;

    if (!farmId) {
      const ownedFarm = await Farm.findOne({ farmerId: req.user.id });
      if (ownedFarm) farmId = ownedFarm._id;
    }

    if (!farmId) return res.status(404).json({ message: 'No farm found' });

    const members = await Farmer.find({
      $or: [
        { farmId: farmId },
        { _id: (await Farm.findById(farmId)).farmerId }
      ]
    });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/farm/member/:memberId', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const requester = await Farmer.findById(req.user.id);
    const ownedFarm = await Farm.findOne({ farmerId: requester._id });

    if (!ownedFarm) return res.status(403).json({ message: 'Only owner can remove members' });

    const memberToRemove = await Farmer.findById(req.params.memberId);
    if (!memberToRemove) return res.status(404).json({ message: 'Member not found' });

    if (memberToRemove.farmId.toString() !== ownedFarm._id.toString()) {
      return res.status(400).json({ message: 'Member does not belong to your farm' });
    }

    memberToRemove.farmId = undefined;
    await memberToRemove.save();

    res.status(200).json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/farm/:farmId', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const farm = await Farm.findOne({ _id: req.params.farmId, farmerId: req.user.id });
    if (!farm) return res.status(403).json({ message: 'Not authorized' });

    Object.assign(farm, req.body);
    await farm.save();
    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/pond/:pondId', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const pond = await Pond.findById(req.params.pondId);
    if (!pond) return res.status(404).json({ message: 'Pond not found' });

    const farm = await Farm.findOne({ _id: pond.farmId, farmerId: req.user.id });
    if (!farm) return res.status(403).json({ message: 'Not authorized' });

    await Pond.findByIdAndDelete(req.params.pondId);
    res.status(200).json({ message: 'Pond deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/farm/leave', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const user = await Farmer.findById(req.user.id);
    if (!user.farmId) return res.status(400).json({ message: 'You are not in a farm' });

    const farm = await Farm.findById(user.farmId);
    if (farm && farm.farmerId.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'Owner cannot leave the farm. Delete the farm instead.' });
    }

    user.farmId = undefined;
    await user.save();

    res.status(200).json({ message: 'Left farm successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/farm', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const user = await Farmer.findById(req.user.id);
    const farm = await Farm.findOne({ farmerId: user._id });

    if (!farm) return res.status(404).json({ message: 'Farm not found or you are not the owner' });

    // Remove all members from the farm
    await Farmer.updateMany({ farmId: farm._id }, { $unset: { farmId: "" } });

    // Delete all ponds associated with the farm
    await Pond.deleteMany({ farmId: farm._id });

    // Delete the farm
    await Farm.findByIdAndDelete(farm._id);

    res.status(200).json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
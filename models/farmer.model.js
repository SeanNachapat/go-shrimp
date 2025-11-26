const mongoose = require('mongoose');

const FarmerSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            sparse: true
        },
        lineId: {
            type: String,
            unique: true,
            sparse: true
        },
        fullName: {
            type: String,
            required: true
        },
        picture: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'farmer'],
            default: 'farmer'
        },
        farmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Farmer = mongoose.model("Farmer", FarmerSchema);
module.exports = Farmer;
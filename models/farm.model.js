const mongoose = require('mongoose');

const FarmSchema = mongoose.Schema(
    {
        farmName: { 
            type: String, 
            required: true 
        },
        farmerId: { 
            type: mongoose.Schema.ObjectId, 
            ref: 'Farmer', 
            required: true 
        },
        location: { 
            type: String 
        },
        coordinates: {
        latitude: { 
            type: Number 
        },
        longitude: { 
            type: Number 
        }
    },
        totalAreaSqm: { 
            type: Number 
        },
        isActive: { 
            type: Boolean, 
            default: true 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
    }
);

FarmSchema.index({ farmerId: 1 });
const Farm = mongoose.model("Farm", FarmSchema);
module.exports = Farm;
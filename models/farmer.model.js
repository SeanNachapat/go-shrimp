const mongoose = require('mongoose');

const FarmerSchema = mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true 
        },
        fullName: { 
            type: String, 
            required: true 
        },
        role: { 
            type: String, 
            enum: ['admin', 'manager', 'employee', 'farmer'],
            default: 'employee'
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

FarmerSchema.index({ username: 1 });
const Farmer = mongoose.model("Farmer", FarmerSchema);
module.exports = Farmer;
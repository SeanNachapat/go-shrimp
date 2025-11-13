const mongoose = require('mongoose');

const PondSchema = mongoose.Schema(
    {
        pondName: { 
            type: String, 
            required: true 
        },
        farmId: { 
            type: mongoose.Schema.ObjectId, 
            ref: 'Farm', 
            required: true 
        },
        areaSqm: { 
            type: Number, 
            required: true 
        },
        depthM: { 
            type: Number 
        },
        pondType: { 
            type: String, 
            enum: ['intensive', 'semi-intensive', 'extensive'],
            default: 'semi-intensive'
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

PondSchema.index({ farmId: 1, isActive: 1 });
const Pond = mongoose.model("Pond", PondSchema);
module.exports = Pond;
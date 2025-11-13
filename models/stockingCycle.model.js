const mongoose = require('mongoose');

const stockingCycleSchema = mongoose.Schema(
    {
        pondId: { 
            type: mongoose.Schema.ObjectId, 
            ref: 'Pond', 
            required: true 
        },
        shrimpSpecies: { 
            type: String, 
            default: 'Litopenaeus vannamei'
        },
        stockDate: { 
            type: Date, 
            required: true 
        },
        initialCount: { 
            type: Number, 
            required: true 
        },
        initialAvgWeightG: { 
            type: Number 
        },
        postLarvaeAgeDays: { 
            type: Number 
        }, 
        expectedHarvestDate: { 
            type: Date 
        },
        actualHarvestDate: { 
            type: Date 
        },
        cycleStatus: { 
            type: String, 
            enum: ['active', 'completed', 'terminated'],
            default: 'active'
        },
        notes: { 
            type: String 
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

stockingCycleSchema.index({ pondId: 1, cycleStatus: 1 });
stockingCycleSchema.index({ stockDate: -1 });
const StockingCycle = mongoose.model('StockingCycle', stockingCycleSchema);
module.exports = StockingCycle;
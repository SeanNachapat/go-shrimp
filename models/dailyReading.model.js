const mongoose = require('mongoose');

const dailyReadingSchema = mongoose.Schema(
    {
        pondId: { 
            type: mongoose.Schema.ObjectId, 
            ref: 'Pond', 
            required: true 
        },
        cycleId: { 
            type: mongoose.Schema.ObjectId, 
            ref: 'StockingCycle', 
            required: true 
        },
        readingDatetime: { 
            type: Date, 
            required: true 
        },
        readingSession: { 
            type: String, 
            enum: ['morning', 'afternoon', 'evening'],
            required: true 
        },
        daysOfCulture: { type: Number },
        
        // Water Quality Parameters
        waterQuality: {
            temperatureCelsius: { type: Number },
            salinityPpt: { type: Number },
            waterDepthCm: { type: Number },
            waterColor: { 
            type: String,
            enum: ['clear', 'light_green', 'dark_green', 'brown', 'murky']
            },
            dissolvedOxygenMgl: { type: Number },
            phLevel: { type: Number },
            ammoniaNh3Mgl: { type: Number },
            nitriteNo2Mgl: { type: Number },
            nitrateNo3Mgl: { type: Number },
            alkalinityMgl: { type: Number }
        },
        
        // Shrimp Health Observations
        healthObservation: {
            sampleSize: { type: Number },
            avgBodyLengthCm: { type: Number },
            avgWeightG: { type: Number },
            estimatedSizeCountPerKg: { type: Number },
            
            // Physical appearance
            shellHardness: { 
            type: String,
            enum: ['soft', 'medium', 'hard']
            },
            bodyColor: { 
            type: String,
            enum: ['normal', 'pale', 'dark', 'reddish', 'white_spots']
            },
            shellCondition: {
            type: String,
            enum: ['clean', 'fouling', 'damaged']
            },
            
            // Activity & Behavior
            activityLevel: { 
            type: String,
            enum: ['active', 'sluggish', 'hyperactive', 'at_surface']
            },
            swimmingPattern: {
            type: String,
            enum: ['normal', 'erratic', 'circling', 'sideways', 'not_swimming']
            },
            
            // Disease Symptoms
            diseaseSymptoms: {
            whiteSpotsPresent: { type: Boolean, default: false },
            redDiscoloration: { type: Boolean, default: false },
            blackGills: { type: Boolean, default: false },
            paleGills: { type: Boolean, default: false },
            looseShell: { type: Boolean, default: false },
            antennaBroken: { type: Boolean, default: false },
            tailRot: { type: Boolean, default: false },
            muscleNecrosis: { type: Boolean, default: false },
            foulingPresent: { type: Boolean, default: false },
            lethargy: { type: Boolean, default: false },
            gatheringAtEdges: { type: Boolean, default: false },
            floating: { type: Boolean, default: false }
            },
            
            // Mortality
            mortalityCount: { type: Number, default: 0 },
            mortalityLocation: {
            type: String,
            enum: ['bottom', 'surface', 'edges', 'throughout']
            }
        },
        
        // Feeding Information
        feeding: {
            feedType: { type: String },
            feedSize: { 
            type: String,
            enum: ['crumble', '1mm', '2mm', '3mm', '4mm']
            },
            feedProteinPercent: { type: Number },
            amountFedKg: { type: Number },
            feedingMethod: {
            type: String,
            enum: ['broadcast', 'feed_tray', 'automatic']
            },
            appetiteRating: { 
            type: Number, 
            min: 1, 
            max: 5 
            },
            consumptionRate: {
            type: String,
            enum: ['complete', 'mostly_eaten', 'partial', 'minimal']
            },
            timeToEatMinutes: { type: Number }
        },
        
        // Environmental Conditions
        environment: {
            airTemperatureCelsius: { type: Number },
            weather: {
            type: String,
            enum: ['sunny', 'partly_cloudy', 'cloudy', 'rainy', 'stormy']
            },
            rainfallMm: { type: Number },
            windCondition: {
            type: String,
            enum: ['calm', 'light_breeze', 'windy', 'strong_wind']
            }
        },
        
        // Alerts & Actions
        alerts: [{
            alertType: {
            type: String,
            enum: ['low_oxygen', 'high_ammonia', 'poor_water_quality', 
                    'disease_symptoms', 'high_mortality', 'poor_feeding', 
                    'equipment_malfunction', 'weather_concern']
            },
            severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical']
            }
        }],
        
        actionsTaken: [{
            action: { type: String },
            timestamp: { type: Date, default: Date.now }
        }],
        
        // Metadata
        recordedBy: { type: mongoose.Schema.ObjectId, ref: 'Farmer', required: true },
        notes: { type: String },
        photoUrls: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
    }
);

dailyReadingSchema.index({ pondId: 1, readingDatetime: -1 });
dailyReadingSchema.index({ cycleId: 1, readingDatetime: -1 });
dailyReadingSchema.index({ readingDatetime: -1 });
dailyReadingSchema.index({ 'waterQuality.dissolvedOxygenMgl': 1 });
dailyReadingSchema.index({ 'healthObservation.mortalityCount': 1 });

const DailyReading = mongoose.model('DailyReading', dailyReadingSchema);
module.exports = DailyReading;

const mongoose = require('mongoose');

const FarmerSchema = mongoose.Schema(
    {
        name: {
            type : String,
        }
    },
    {
        timestamps : true,
    }
)

const Farmer = mongoose.model("Farmer", FarmerSchema);

module.exports = Farmer;
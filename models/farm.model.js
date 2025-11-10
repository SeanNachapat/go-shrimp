const mongoose = require('mongoose');

const FarmSchema = mongoose.Schema(
    {
        name : {
        type: String,
        require : [true, "Farm name is required"]
        },
        name : {
        type: String,
        require : [true, "Farm name is required"]
        },
        name : {
        type: String,
        require : [true, "Farm name is required"]
        }
    }
)

const Farm = mongoose.model("Farm", FarmSchema);

module.exports = Farm;
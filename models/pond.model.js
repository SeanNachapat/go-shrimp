const mongoose = require('mongoose');

const PondSchema = mongoose.Schema(
    {
        pondNum : {
            type: Number, 
        },
    },
    {
        Timestamp: true
    }
)

const Pond = mongoose.model("Pond", PondSchema);

module.exports = Pond;
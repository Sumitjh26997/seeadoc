var mongoose = require('mongoose');

var LogsSchema = mongoose.Schema({
    clinic: { type: String, ref: 'Clinic' },
    status: { type: String },
    date: { type: String },
    booking: { type: String, ref: 'Booking' },
},
    {
        timestamps: true,
        collection: "Logs"
    });

var Logs = module.exports = mongoose.model('Logs', LogsSchema);

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var BookingSchema = mongoose.Schema({
    number: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    sequence: { type: String, required: true },
    status: { type: String, default: 'queued' },
    timeMissed: { type: String },
},
{
    timestamps: true,
    collection: "Booking"
});

var Booking = module.exports = mongoose.model('Booking', BookingSchema);

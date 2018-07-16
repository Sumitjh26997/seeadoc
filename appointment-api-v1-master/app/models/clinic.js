var mongoose = require('mongoose');

var ClinicSchema = mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String },
    description: { type: String },
    addressShot: { type: String },
    addressFull: { type: String },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    openTime: { type: String },
    closeTime: { type: String },
    isOpen: { type: Boolean },
    clinicPhoto: { type: String },
    workingDays: [{ type: String }],
    allowBookingFor: { type: String },
    queueCount: { type: String },
    noticeBoard: { type: String },
    map: { type: String, default: '' },
    noticeBoardIsActive: { type: Boolean },
    isActive: { type: Boolean },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]
},
    {
        timestamps: true,
        collection: "Clinic"
    });

var Clinic = module.exports = mongoose.model('Clinic', ClinicSchema);

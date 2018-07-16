var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema = mongoose.Schema({
    name: { type: String, required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true  },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    mobile: { type: Number, default: null },
    email: { type: String },
    password: { type: String },
    specialization: { type: String },
    experience: { type: String },
    profile: { type: String },
    photo: { type: String },
    isActive: { type: Boolean, default: true },
    clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true  }
},
    {
        timestamps: true,
        collection: "Doctor"
    });

var doctor = module.exports = mongoose.model('Doctor', doctorSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: { type: String },
    gender: { type: String, default: null },
    blood_group: { type: String, default: null },
    dob: { type: String, default: null },
    mobile: { type: String, unique: true},
    alt_mobile: { type: Number, default: null },
    email: { type: String, unique: false },
    password: { type: String, default: null },
    address: { type: String, default: null },
    area: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pincode: { type: Number, default: null},
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    aadhar: { type: Number, default: null },
    isPrimary: { type: String },
    isLoggedIn: { type: Boolean, default: true },
    photo: { type: String, default: '' }
},
    {
        timestamps: true,
        collection: 'User'
    }));
var mongoose = require('mongoose');

var LocationSchema = mongoose.Schema({
    country: { type: String },
    state: { type: String },
    town: { type: String },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
},
{
    timestamps: true,
    collection: "Location"
});

var Location = module.exports = mongoose.model('Location', LocationSchema);

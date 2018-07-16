var mongoose = require('mongoose');

var SlotSchema = mongoose.Schema({
    clinic: { type: String, required: true },
    slot: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true,
        collection: "Slot"
    });

var Slot = module.exports = mongoose.model('Slot', SlotSchema);

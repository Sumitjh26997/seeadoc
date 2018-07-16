var mongoose = require('mongoose');

var SuggestionSchema = mongoose.Schema({
    userId: { type: String, required:true },
    doctor: { type: String },
    mobile: { type: String },
    isContacted: { type: Boolean, default: false },
    note: { type: String }

},
    {
        timestamps: true,
        collection: "Suggestion"
    });

var Suggestion = module.exports = mongoose.model('Suggestion', SuggestionSchema);

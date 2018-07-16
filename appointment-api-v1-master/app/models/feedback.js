var mongoose = require('mongoose');

var FeedbackSchema = mongoose.Schema({
    bookingId: { type: String, required: true },
    rating: { type: String, required: true },
    message: { type: String },
    isSatisfy: { type: String, required: true }
},
    {
        timestamps: true,
        collection: "Feedback"
    });

var Feedback = module.exports = mongoose.model('Feedback', FeedbackSchema);

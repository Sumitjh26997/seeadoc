var mongoose = require('mongoose');

var OTPSchema = mongoose.Schema({
    otp: { type: String },
    mobile: { type: String},
}, 
{
    timestamps: true,
    collection: "OTP"
});

var OTP = module.exports = mongoose.model('OTP', OTPSchema);

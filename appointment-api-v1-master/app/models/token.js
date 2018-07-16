var mongoose = require('mongoose');

var TokenSchema = mongoose.Schema({
    token: { type: String },
    userId: { type: String, ref: 'User' },
    email: { type: String, ref: 'User' }
}, 
{
    timestamps: true,
    collection: "Token"
});

var Token = module.exports = mongoose.model('Token', TokenSchema);

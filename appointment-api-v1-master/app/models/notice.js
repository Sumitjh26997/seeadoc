var mongoose = require('mongoose');

var NoticeSchema = mongoose.Schema({
    clinic: { type: String, default:null },
    date: { type: String, default:null },
    notice: { type: String, default:null },
    isActive: { type: Boolean, default:null }
},
    {
        timestamps: true,
        collection: "Notice"
    });

var Notice = module.exports = mongoose.model('Notice', NoticeSchema);

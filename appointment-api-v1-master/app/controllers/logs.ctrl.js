const LOGS = require('../models/logs');

module.exports = {
    addLog: addLog,
    deleteLog: deleteLog,
    getLogs: getLogs
};

function addLog(req, res, next) {
    let newLog = new LOGS({
        clinic: req.body.clinic,
        status: req.body.status,
        date: req.body.date,
        booking: req.body.booking,
    });
    newLog.save((err, success) => {
        if (err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'New log has been added',
            data: success
        });
    });
}

function getLogs(req, res, next){
    let query = req.body.query || {};
    LOGS.find(query).populate('clinic booking').then((response)=>{
        res.status(200);
        return res.json({
            success: true,
            message: 'Logs list',
            data: response
        });
    }).catch((err)=>{
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to fetch logs',
            error: err
        });
    });
}


function deleteLog(req, res, next) {
    LOGS.findByIdAndRemove(req.body._id, (err, success) =>{
        if(err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'New log has been deleted',
            data: success
        });
    });
}
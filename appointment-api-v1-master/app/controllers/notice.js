const Notice = require('../models/notice');

module.exports = {
    addNotice: addNotice,
    updateNotice: updateNotice,
    fetchNotice: fetchNotice,
    deleteNotice: deleteNotice
};

function addNotice(req, res, next) {
  
    let notice = new Notice({
        clinic: req.body.clinic,
        date: req.body.date,
        notice: req.body.notice,
        isActive: req.body.isActive
    });

    notice.save(notice).then((response)=>{
        res.status(200);
        return res.json({
            success:true,
            message:'Notice has been saved successfully !',
            notice: response
        });
    }).catch((error)=>{
        res.status(400);
        return res.json({
            success:false,
            message:'Unable to save notice !',
            error: error
        });
    });
}

function updateNotice(req, res, next) {
    if (req.body._id==null) {
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to update notice, Unique id(_id) not found !",
        });
    } else {
        Notice.findByIdAndUpdate(req.body._id, req.body, { new: true }).then((response)=>{
            res.status(200);
            return res.json({
                success:true,
                message:'Notice has been updated successfully !',
                notice:response
            });
        }).catch((error)=>{
            res.status(400);
            return res.json({
                success:false,
                message:'Unbale to update notice !',
                error: error
            });
        });
    }
}

function fetchNotice(req, res, next) {
    let query = req.body.query || {};
    Notice.find(query).then((response)=>{
        res.status(200);
        return res.json({
            success:true,
            message:'Notice fetched successfully !',
            notice: response
        });
    }).catch((error)=>{
        res.status(400);
        return res.json({
            success:false,
            message: 'Unable to fetch notice !',
            error: error
        });
    });
}

function deleteNotice(req, res, next) {
    if (req.body._id==null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to delete notice, unique id(_id) not found !'
        });
    } else {
        Notice.findByIdAndRemove(req.body._id).then((response)=>{
            res.status(200);
            return res.json({
                success: true,
                message: 'Notice has been deleted successfully !',
                notice: response
            });
        }).catch((error)=>{
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to delete notice !',
                error: error
            });
        });
    }
}
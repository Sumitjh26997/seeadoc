const Suggestion = require('../models/suggestion');

module.exports = {
    addSuggestion: addSuggestion,
    updateSuggestion: updateSuggestion,
    fetchSuggestion: fetchSuggestion,
    deleteSuggestion: deleteSuggestion
};

function addSuggestion(req, res, next) {
  
    let suggestion = new Suggestion({
        userId: req.body.userId,
        doctor: req.body.doctor,
        mobile: req.body.mobile,
        note: req.body.note
    });

    suggestion.save(suggestion).then((response)=>{
        res.status(200);
        return res.json({
            success:true,
            message:'Suggestion has been saved successfully !',
            data: response
        });
    }).catch((error)=>{
        res.status(400);
        return res.json({
            success:false,
            message:'Unable to save suggestion !',
            data: error
        });
    });
}

function updateSuggestion(req, res, next) {
    if (req.body._id==null) {
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to update suggestion, Unique id(_id) not found !",
        });
    } else {
        Suggestion.findByIdAndUpdate(req.body._id, req.body, { new: true }).then((response)=>{
            res.status(200);
            return res.json({
                success:true,
                message:'Suggestion has been updated successfully !',
                data:response
            });
        }).catch((error)=>{
            res.status(400);
            return res.json({
                success:false,
                message:'Unbale to update suggestion !',
                data: error
            });
        });
    }
}

function fetchSuggestion(req, res, next) {
    let query = req.body.query || {};
    Suggestion.find(query).then((response)=>{
        res.status(200);
        return res.json({
            success:true,
            message:'Suggestion fetched successfully !',
            data: response
        });
    }).catch((error)=>{
        res.status(400);
        return res.json({
            success:false,
            message: 'Unable to fetch suggestion !',
            data: error
        });
    });
}

function deleteSuggestion(req, res, next) {
    if (req.body._id==null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to delete suggestion, unique id(_id) not found !'
        });
    } else {
        Suggestion.findByIdAndRemove(req.body._id).then((response)=>{
            res.status(200);
            return res.json({
                success: true,
                message: 'Suggestion has been deleted successfully !',
                suggestion: response
            });
        }).catch((error)=>{
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to delete suggestion !',
                error: error
            });
        });
    }
}
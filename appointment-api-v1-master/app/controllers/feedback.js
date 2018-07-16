const Feedback = require('../models/feedback');

module.exports = {
    addFeedback: addFeedback,
    updateFeedback: updateFeedback,
    fetchFeedback: fetchFeedback,
    deleteFeedback: deleteFeedback
};

function addFeedback(req, res, next) {
    console.log('Feedback');
    let feedback = new Feedback({
        bookingId: req.body.bookingId,
        rating: req.body.rating,
        message: req.body.message,
        isSatisfy: req.body.isSatisfy
    });

    feedback.save((err, success) => {
        if (err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'Feedback has been saved successfully !',
            data: success
        });
    });
}

function updateFeedback(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to update feedback, Unique id(_id) not found !",
        });
    } else {
        Feedback.findByIdAndUpdate(req.body._id, req.body, { new: true }).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Feedback has been updated successfully !',
                feedback: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unbale to update feedback !',
                error: error
            });
        });
    }
}

function fetchFeedback(req, res, next) {
    let query = req.body.query || {};
    Feedback.find(query).then((response) => {
        res.status(200);
        return res.json({
            success: true,
            message: 'Feedback fetched successfully !',
            feedback: response
        });
    }).catch((error) => {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to fetch feedback !',
            error: error
        });
    });
}

function deleteFeedback(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to delete feedback, unique id(_id) not found !'
        });
    } else {
        Feedback.findByIdAndRemove(req.body._id).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Feedback has been deleted successfully !',
                feedback: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to delete feedback !',
                error: error
            });
        });
    }
}
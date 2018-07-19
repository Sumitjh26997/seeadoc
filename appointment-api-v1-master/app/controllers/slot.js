const Slot = require('../models/slot');
const BOOKING = require('../models/booking');
var _ = require('lodash');

module.exports = {
    addSlot: addSlot,
    updateSlot: updateSlot,
    fetchSlot: fetchSlot,
    deleteSlot: deleteSlot
};

function addSlot(req, res, next) {

    let slot = new Slot({
        clinic: req.body.clinic,
        slot: req.body.slot,
        start: req.body.start,
        end: req.body.end,
        isActive: req.body.isActive
    });

    slot.save(slot).then((response) => {
        res.status(200);
        return res.json({
            success: true,
            message: 'Slot has been saved successfully !',
            data: response
        });
    }).catch((error) => {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to save slot !',
            data: error
        });
    });
}

function updateSlot(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to update slot, Unique id(_id) not found !",
        });
    } else {
        Slot.findByIdAndUpdate(req.body._id, req.body, { new: true }).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Slot has been updated successfully !',
                data: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unbale to update slot !',
                data: error
            });
        });
    }
}

function fetchSlot(req, res, next) {
    let date = new Date();
    let today = date.getDay();// get current day and query against it
    let query = req.body.query || {};
    console.log('Quesry', query);
    BOOKING.find(query, (err, bookings) => {
        if (err) throw err;
        bookings = _.groupBy(bookings, 'slot');
        // console.log('Bookings', bookings);
        Slot.find({ clinic: query.clinic , day:today}, (err, slots) => {
            if (err) throw err;
            res.status(200);
            return res.json({
                success: true,
                message: 'Slots',
                data: {
                    slots: slots,
                    bookings: bookings
                }
            });

        });

    });
}

function deleteSlot(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to delete Slot, unique id(_id) not found !'
        });
    } else {
        Slot.findByIdAndRemove(req.body._id).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Slot has been deleted successfully !',
                data: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to delete Slot !',
                data: error
            });
        });
    }
}
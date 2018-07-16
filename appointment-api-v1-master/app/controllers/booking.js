const Booking = require('../models/booking');
const Clinic = require('../models/clinic');
const LOGS = require('../models/logs');
var Promise = require("bluebird");

module.exports = {
    addBooking: addBooking,
    updateBooking: updateBooking,
    fetchBooking: fetchBooking,
    cancelBooking: cancelBooking,
    deleteBooking: deleteBooking,
    fetchAsClinic: fetchAsClinic,
    fetchAsPatient: fetchAsPatient,
    changeStatus: changeStatus
};

function dateFormator(fullDate) {

    let year = fullDate.getUTCFullYear();
    let month = fullDate.getUTCMonth() < 10 ? '0' + (fullDate.getUTCMonth() + 1) : fullDate.getUTCMonth() + 1;
    let date = fullDate.getUTCDate() < 10 ? '0' + fullDate.getUTCDate() : fullDate.getUTCDate();
    return (year + '-' + month + '-' + date);
}

function bookingSlotTime(startTime, endTime, count, sequenceNumber) {

    var startHours = parseInt(startTime.split(":")[0]);
    var endHours = parseInt(endTime.split(":")[0]);
    var startMinutes = parseInt(startTime.split(":")[1]);
    var endMinutes = parseInt(endTime.split(":")[1]);
    var totalSlotMinutes = 0;
    var totalSlotHours = endHours - startHours;
    if (totalSlotHours === 0) {
        totalSlotMiutes = endMinutes - startMinutes;
    } else {
        totalSlotMiutes = 60 * totalSlotHours - startMinutes + endMinutes;
    }

    var queueTime = totalSlotMiutes / count;
    var sequenceTime = queueTime * sequenceNumber;
    startMinutes += sequenceTime;

    if (startMinutes >= 60) {
        var hours = parseInt(startMinutes / 60);
        startHours = parseInt(startHours) + hours;
        startMinutes = parseInt(startMinutes % 60);
    }
    if (startHours < 10) {
        startHours = '0' + startHours;
    }
    if (startMinutes < 10) {
        startMinutes = '0' + startMinutes;
    }
    return (startHours + ':' + startMinutes);
}

function addBooking(req, res, next) {
    console.log(req.body.bookingDate);
    let currentDate = dateFormator((new Date(req.body.bookingDate)));
    console.log('Date: ', currentDate);
    let newData = {
        clinic: req.body.clinic,
        doctor: req.body.doctor,
        user: req.body.user,
        patient: req.body.patient, 
        date: req.body.bookingDate
    }
    Booking.find(newData).then((response)=>{
        console.log(response);
        if(response.length==0)
        {
            let query = {
                date: currentDate,
                slot: req.body.slot
            };
            Booking.find(query, (err, bookings) => {
                if (err) throw err;
                console.log('QueueCount: ', req.body.queueCount);
                console.log('Bookings: ', bookings.length);
                if (bookings.length >= req.body.queueCount) {
                    res.status(400);
                    return res.json({
                        success: false,
                        message: 'No more slots available',
                        data: bookings
                    });
                } else {

                    let query_2 = {
                        date:
                            {
                                $regex: new RegExp(currentDate.slice(0, (currentDate.length - 3)), "ig")
                            }
                    };

                    Booking.find(query_2, (err, success) => {
                        if (err) throw err;
                        let bookingToken = 1000 + (success.length + 1);
                        let sequence = bookings.length + 1;

                        let booking = new Booking({
                            number: bookingToken,
                            user: req.body.user,
                            patient: req.body.patient,
                            time: bookingSlotTime(req.body.startTime, req.body.endTime, req.body.queueCount, sequence - 1),
                            date: req.body.bookingDate,
                            doctor: req.body.doctor,

                            location: req.body.location,
                            clinic: req.body.clinic,
                            slot: req.body.slot,
                            sequence: sequence,
                        });

                        booking.save(booking).then((response) => {
                            res.status(200);
                            return res.json({
                                success: true,
                                message: 'Booking has been saved successfully !',
                                data: response
                            });
                        }).catch((error) => {
                            res.status(400);
                            return res.json({
                                success: false,
                                message: 'Unable to save booking !',
                                data: error
                            });
                        });
                    });
                }
            });
        }
        else
        {
            res.status(400);
            return res.json({
                success: false,
                message: "You can not book multiple slot !",
            });
        }
    }).catch((err)=>{
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to book appointment !"
        });
    }); 
}

function updateBooking(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to update booking, Unique id(_id) not found !",
        });
    } else {
        data = {
            user: req.body.user,
            patient: req.body.patient,
            date: req.body.date,
            doctor: req.body.doctor,
            location: req.body.location,
            clinic: req.body.clinic,
            status: req.body.status
        }
        Booking.findByIdAndUpdate(req.body._id, data, { new: true }).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Booking has been updated successfully !',
                booking: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unbale to update booking !',
                error: error
            });
        });
    }
}

function fetchBooking(req, res, next) {
    let query = req.body.query || {};
    Booking.find(query).populate('clinic doctor patient slot').exec((err, success) => {
        if (err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'BookingList',
            data: success
        });
    });
}

function fetchAsPatient(req, res, next) {
    let query = req.body.query || {};
    Booking.find({user: query.user, status: query.status}).populate('patient clinic doctor slot').then((res_one)=>{

        var newData = [];
        var res_one_length = res_one.length;
        var matchCount = 0;
        console.log(res_one_length, res_one);
        if(res_one_length>0){
            res_one.map((element_one)=>{    
                Booking.find({clinic: element_one.clinic._id, status: 'queued'}).then((res_two)=>{
                    var count = 0;
                    res_two.forEach((element_two)=>{
                        count++;
                        if((element_one._id).toString() == (element_two._id).toString()){
                            matchCount++;
                            var data = {
                                _id: element_one._id,
                                updatedAt: element_one.updatedAt,
                                createdAt: element_one.createdAt,
                                number: element_one.number,
                                user: element_one.user,
                                patient: element_one.patient,
                                time: element_one.time,
                                date: element_one.date,
                                doctor: element_one.doctor,
                                location: element_one.location,
                                clinic: element_one.clinic,
                                slot: element_one.slot,
                                sequence: element_one.sequence,
                                position: count,
                                status: element_one.status,
                                __v: 0
                            };
                            newData.push(data);
                            if(matchCount==res_one_length){
                                res.status(200);
                                return res.json({
                                    success: true,
                                    message: 'Booking List !',
                                    data: newData
                                });
                            }
                        }
                    });
                }).catch((err)=>{
                    res.status(400);
                    return res.json({
                        success: false,
                        message: 'Unable to fetch booking list !',
                        error: err
                    });
                });
            });
        }
        else{
            res.status(200);
            return res.json({
                success: true,
                message: 'Booking List !',
                data: res_one
            }); 
        }
    }).catch((err)=>{
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to fetch booking list !',
            error: err
        });
    });
}

function deleteBooking(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to delete booking, unique id(_id) not found !'
        });
    } else {
        Booking.findByIdAndRemove(req.body._id).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Booking has been deleted successfully !',
                booking: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to delete booking !',
                error: error
            });
        });
    }
}

function cancelBooking(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to cancel booking, unique id(_id) not found !'
        });
    } else {
        Booking.findByIdAndUpdate(req.body._id, { status: 'cancelled' }).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Booking has been cancelled successfully !',
                data: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to cancel booking !',
                data: error
            });
        });
    }
}

function fetchAsClinic(req, res, next) {
    let query = req.body.query || {};
    Booking.find(query).populate('clinic doctor patient slot').sort('-time').exec((err, bookings) => {
        if (err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'BookingList',
            data: bookings
        });
    });
}

function changeStatus(req, res, next) {
    Booking.findByIdAndUpdate(req.body._id, { status: req.body.status }, { new: true }, (err, success) => {
        if (err) throw err;
        let newLog = new LOGS({
            clinic: req.body.clinic,
            status: req.body.status,
            date: dateFormator(new Date()),
            booking: req.body._id,
        });
        newLog.save();
        res.status(200);
        return res.json({
            success: true,
            message: 'BookingList',
            data: success
        });
    });
}
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const config = require('../config');
const LOGS = require('../models/logs');

const Clinic = require('../models/clinic');
const tokenExpireTime = '1000 days';
const mailFunction = require('./mail');

module.exports = {
    signInClinic: signInClinic,
    addClinic: addClinic,
    login: login,
    updateClinic: updateClinic,
    fetchClinic: fetchClinic,
    deleteClinic: deleteClinic,
    changeClinicStatus: changeClinicStatus,
    forgotPasswordClinic: forgotPasswordClinic,
    changePasswordClinic: changePasswordClinic
};

function dateFormator(fullDate) {

    let year = fullDate.getUTCFullYear();
    let month = fullDate.getUTCMonth() < 9 ? '0' + (fullDate.getUTCMonth() + 1) : fullDate.getUTCMonth() + 1;
    let date = fullDate.getUTCDate() < 10 ? '0' + fullDate.getUTCDate() : fullDate.getUTCDate();
    return (year + '-' + month + '-' + date);
}

function signInClinic(req, res) {

    if (!req.body.email || !req.body.password) {
        res.status(400);
        return res.json({
            success: false,
            message: "Required field error !",
            data: null
        });
    }
    Clinic.findOne({ email: req.body.email }).populate('doctors').exec((err, clinic) => {
        if (err) {
            res.status(400);
            return res.json({
                success: false,
                message: "Internal server error !",
                error: err
            });
        }
        if (!clinic) {
            res.status(400);
            return res.json({
                success: false,
                message: "Clinic not found !",
                data: null
            });
        }
        else {
            if (bcrypt.compareSync(req.body.password, clinic.password)) {
                var payload = {
                    _id: clinic._id,
                    email: clinic.email
                }
                var token = jwt.sign({ data: payload }, config.token_secret, { expiresIn: config.token_expire });
                clinic.password = '';
                res.status(200);
                return res.json({
                    success: true,
                    message: "Logged in successfully !",
                    token: token,
                    data: clinic
                });
            }
            else {
                res.status(400);
                return res.json({
                    success: false,
                    message: "Password doesn't match !",
                    data: null
                });
            }
        }
    });
}

function addClinic(req, res, next) {
    let clinic = new Clinic({
        name: req.body.name,
        location: req.body.location,
        doctors: req.body.doctors,
        email: req.body.email,
        password: req.body.password,
        description: req.body.description,
        addressShot: req.body.addressShot,
        addressFull: req.body.addressFull,
        openTime: req.body.openTime,
        closeTime: req.body.closeTime,
        isOpen: req.body.isOpen,
        clinicPhoto: req.body.clinicPhoto,
        workingDays: req.body.workingDays,
        allowBookingFor: req.body.allowBookingFor,
        queueCount: req.body.queueCount,
        noticeBoard: req.body.noticeBoard,
        map: req.body.map,
        noticeBoardIsActive: req.body.noticeBoardIsActive,
        isActive: req.body.isActive,
        mobile: req.body.mobile,
        lat: req.body.lat,
        lng: req.body.lng
    });

    var salt = bcrypt.genSaltSync(10);
    clinic.password = bcrypt.hashSync(clinic.password, salt);

    clinic.save(clinic).then((response) => {
        res.status(200);
        return res.json({
            success: true,
            message: 'Clinic has been saved successfully !',
            data: response
        });
    }).catch((error) => {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to save clinic !',
            data: error
        });
    });
}

function updateClinic(req, res, next) {
    if (!req.body._id || !req.body.data) {
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to update clinic, Unique id(_id) not found !",
            data: null
        });
    } else {
        Clinic.findByIdAndUpdate(req.body._id, req.body.data, { new: true }).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Clinic has been updated successfully !',
                data: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unbale to update clinic !',
                data: error
            });
        });
    }
}

function fetchClinic(req, res, next) {
    let query = req.body.query || {};
    Clinic.find(query).populate('doctors').exec((err, clinics) => {
        if (err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'Clinics list',
            data: clinics
        });
    });
}

function deleteClinic(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to delete clinic, unique id(_id) not found !'
        });
    } else {
        Clinic.findByIdAndRemove(req.body._id).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Clinic has been deleted successfully !',
                data: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to delete clinic !',
                data: error
            });
        });
    }
}

function login(req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(400);
        return res.json({
            success: false,
            message: "Invalid Credentials",
            data: null
        });
    } else {
        Clinic.findOne({ email: req.body.email }, (err, clinic) => {
            if (err) throw err;
            if (!clinic) {
                res.status(400);
                return res.json({
                    success: false,
                    message: 'Clinic not found',
                    data: null
                });
            } else {
                if (!bcrypt.compareSync(req.body.password, clinic.password)) {
                    res.status(400);
                    return res.json({
                        success: false,
                        message: 'Wrong password',
                        data: null
                    });
                } else {
                    var token = jwt.sign({ data: clinic }, 'SEE-A-DOC', { expiresIn: tokenExpireTime });
                    clinic.password = '';
                    res.status(200);
                    return res.json({
                        success: true,
                        message: 'Login successful',
                        token: token,
                        data: clinic
                    });
                }
            }
        });
    }
}

function changeClinicStatus(req, res, next) {
    Clinic.findByIdAndUpdate(req.body._id, {isOpen: req.body.isOpen}, { new: true }).then((response) => {
        let newLog = new LOGS({
            clinic: req.body._id,
            status: req.body.isOpen ? 'Opened' : 'closed',
            date: dateFormator(new Date()),
        });
        newLog.save();

        res.status(200);
        return res.json({
            success: true,
            message: 'Clinic status changed successfully !',
            data: response
        });
    }).catch((error) => {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unbale to change clinic status !',
            data: error
        });
    });
}

function changePasswordClinic(req, res) {
           
    if (!req.body._id) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to change password, Unique id not found !'
        });
    }
    else {
        Clinic.findById(req.body._id, (err, user) => {
            if (err) {
                res.status(400);
                return res.json({
                    success: false,
                    message: "Internal server error !",
                    error: err
                });
            }
            if (!user) {
                res.status(400);
                return res.json({
                    success: false,
                    message: 'Clinic not found !'
                });
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.data.password, salt, function (err, hash) {
                        req.body.data.password = hash;
                        Clinic.findByIdAndUpdate(req.body._id, { $set: req.body.data }, (err, user) => {
                            if (err) {
                                res.status(400);
                                return res.json({
                                    success: false,
                                    message: "Internal server error !",
                                    error: err
                                });
                            }
                            res.status(200);
                            return res.json({
                                success: true,
                                message: 'Password updated successfully !',
                                data: user
                            });
                        });
                    });
                });
            }
        });
    }
           
}

function forgotPasswordClinic(req, res) {
    if (!req.body.email && !req.body.mobile) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Email address & mobile number is required !'
        });
    } 
    else 
    {
        Clinic.findOne({ email: req.body.email }).then((response)=>{
            const email = response.email;
            const subject = 'Forgot Password !';
            const html = `
                        <br>Dear <b>${response.name} !</b><br>
                        <p>Your account verification code is <strong>${req.body.code}</strong>.</p><br>
                        <p>Thanks</p>
                        <p>SeeaDOC Support</p>
                        `;
            try {
                (mailFunction.sendEmail(email, subject, html)).then((value) => {
                    if (value) {
                        res.status(200);
                        return res.json({
                            success: true,
                            message: 'Account verification code has been sent to your email !',
                            data: response
                        });
                    }
                    else {
                        res.status(400);
                        return res.json({
                            success: false,
                            message: 'Unable to process request, Please try after sometime...',
                        });
                    }
                });
            }
            catch (e) {
                res.status(400);
                return res.json({
                    success: false,
                    message: 'Unable to process request, Please try after sometime...',
                });
            }
        }).catch((error)=>{
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to find clinic !',
                error: error
            });
        });
    }
}
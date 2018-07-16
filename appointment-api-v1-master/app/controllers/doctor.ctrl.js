const DOCTOR = require('../models/doctor');
const CLINIC = require('../models/clinic');

module.exports = {
    addDoctor: addDoctor,
    updateDoctor: updateDoctor,
    fetchDoctor: fetchDoctor,
    deleteDoctor: deleteDoctor
};

function addDoctor(req, res, next) {

    let doctor = new DOCTOR({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        specialization: req.body.specialization,
        experience: req.body.experience,
        profile: req.body.profile,
        photo: req.body.photo,
        isActive: req.body.isActive,
        clinic: req.body.clinic,
        lat: req.body.lat,
        lng: req.body.lng
    });

    doctor.save((err, success) => {
        if (err) throw err;

        CLINIC.findByIdAndUpdate(req.body.clinic, { $push: { doctors: success._id } }, (err, succ) => {
            if (err) throw err;

            console.log('CLINI', succ);

            res.status(200);
            return res.json({
                success: true,
                message: 'Doctor has been added!',
                data: success
            });
        })

    });
}

function updateDoctor(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: "Unable to update Doctor, Unique id(_id) not found !",
        });
    } else {

        DOCTOR.findByIdAndUpdate(req.body._id, req.body, { new: true }).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Doctor has been updated successfully !',
                data: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unbale to update doctor !',
                error: error
            });
        });
    }
}

function fetchDoctor(req, res, next) {
    let query = req.body.query || {};
    DOCTOR.find(query).populate('clinic').exec((err, doctors) => {
        if (err) throw err;
        res.status(200);
        return res.json({
            success: true,
            message: 'Doctors list',
            data: doctors
        });
    });
}

function deleteDoctor(req, res, next) {
    if (req.body._id == null) {
        res.status(400);
        return res.json({
            success: false,
            message: 'Unable to delete Doctor, unique id(_id) not found !'
        });
    } else {
        DOCTOR.findByIdAndRemove(req.body._id).then((response) => {
            res.status(200);
            return res.json({
                success: true,
                message: 'Doctor has been deleted successfully !',
                feedback: response
            });
        }).catch((error) => {
            res.status(400);
            return res.json({
                success: false,
                message: 'Unable to delete Doctor !',
                error: error
            });
        });
    }
}
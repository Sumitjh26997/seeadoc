const express = require('express');
const router = express.Router();
const Clinic = require('../controllers/clinic');

router.post('/signin', Clinic.signInClinic);
router.post('/add', Clinic.addClinic);
router.post('/update', Clinic.updateClinic);
router.post('/fetch', Clinic.fetchClinic);
router.post('/delete', Clinic.deleteClinic);
router.post('/change-status', Clinic.changeClinicStatus);
router.post('/forgot-password', Clinic.forgotPasswordClinic);
router.post('/reset-password', Clinic.changePasswordClinic);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

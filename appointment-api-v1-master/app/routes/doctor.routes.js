const express = require('express');
const router = express.Router();
const Doctor = require('../controllers/doctor.ctrl');

router.post('/add', Doctor.addDoctor);
router.post('/update', Doctor.updateDoctor);
router.post('/fetch', Doctor.fetchDoctor);
router.post('/delete', Doctor.deleteDoctor);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

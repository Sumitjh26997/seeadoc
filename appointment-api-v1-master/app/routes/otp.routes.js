const express = require('express');
const router = express.Router();
const OTP = require('../controllers/otp.ctrl');

router.post('/send', OTP.sendOTP);
router.post('/verify', OTP.verifyOTP);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

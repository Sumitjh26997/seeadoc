const OTP = require('../models/otp');
const USER = require('../models/user');
const request = require('request');


module.exports = {
    sendOTP: sendOTP,
    verifyOTP: verifyOTP,
};

function sendOTP(req, res, next) {
    if (!req.body.mobile) {
        res.status(400);
        return res.json({
            success: false,
            message: "Invalid credentials",
            data: null
        });
    } else {

        const OTP = Math.floor(1000 + Math.random() * 9000);
        const message = OTP + "%20is%20your%20Login%20Onetime%20password%20(OTP)%20for%20your%20SEEADOC%20account";
        const OTP_URL = "http://api.msg91.com/api/sendotp.php?authkey=204509A0WwikTXDcs05aaff84f&mobile=91" + req.body.mobile + "&message=" + message + "&sender=SEEADOC&otp=" + OTP
        console.log(OTP_URL);
        request(OTP_URL, function (error, response, body) {
            console.log(response);
            console.log('error:', error); // Print the error if one occurred
            if (error || body.type == 'error') {
                res.status(400);
                return res.json({
                    success: false,
                    message: "Unable to send OTP",
                    data: error || body
                });
            } else {
                res.status(200);
                return res.json({
                    success: true,
                    message: 'OTP Sent Successfully!',
                    data: body
                });
            }
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
        });

    }
}

function verifyOTP(req, res, next) {
    if (!req.body.mobile && !req.body.otp) {
        res.status(400);
        return res.json({
            success: false,
            message: "Invalid credentials",
            data: null
        });
    } else {

        const OTP_URL = "http://api.msg91.com/api/verifyRequestOTP.php?authkey=204509A0WwikTXDcs05aaff84f&mobile=91" + req.body.mobile + "&otp=" + req.body.otp;
        request(OTP_URL, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            body = JSON.parse(body);
            if (error) {
                res.status(400);
                return res.json({
                    success: false,
                    message: "Technical Error To verify OTP",
                    data: error || body
                });
            } else if (body.type == 'error') {
                console.log("TYPE", body.type);
                res.status(400);
                return res.json({
                    success: false,
                    message: "This OTP is not valid",
                    data: body
                });
            } else {
                USER.findOne({ mobile: req.body.mobile }, (err, success) => {
                    if (err) throw err;
                    res.status(200);
                    return res.json({
                        success: true,
                        message: 'OTP Verified Successfully!',
                        data: success
                    });
                });
            }
            console.log('statusCode:', response);
            console.log('statusCode:', response.statusCode);
            console.log('body:', body); // Print the HTML for the Google homepage.
        });

    }
}
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('hgjgnishgisuhisjhnistij');
const sender = 'VERIFY';

module.exports = {
    sendOTP:sendOTP,
    verifyOTP:verifyOTP
}

function sendOTP(mobile, otp){

    return new Promise((resolve, reject) => {

        sendOtp.send(mobile, sender, otp, function (error, data, response) {
            if(error || data.type == 'error'){
                resolve(false);
            }
            if(data.type == 'success')
            {
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
        
    });
}

function verifyOTP(mobile, otp){

    return new Promise((resolve, reject) => {

        sendOtp.verify(mobile, otp, function (error, data, response) {
            if(error || data.type == 'error'){
                resolve(false);
            }
            if(data.type == 'success')
            {
                resolve(true);
            }
            else{
                resolve(false);
            }
        });
    });
}
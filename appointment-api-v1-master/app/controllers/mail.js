const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    sendEmail:sendEmail
}

function sendEmail(to, subject, html){

    return new Promise((resolve, reject) => {

        nodemailer.createTestAccount((err, account) => {

            var transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'amitdubeynodemailer@gmail.com',
                    pass: 'NodeMailer'
                }
                }));

            let mailOptions = {
                from: '"Amit Dubey " <amitdubeynodemailer@gmail.com>',
                to: to,
                subject: subject,
                html: html 
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    resolve(false);
                }
                else{
                    resolve(true);
                }
            });
        });

    });
}

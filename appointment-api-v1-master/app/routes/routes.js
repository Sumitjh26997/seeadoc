const express = require('express');
const routes = express.Router();

const userRoutes = require('./user.routes');
const locationRoutes = require('./location.routes');
const bookingRoutes = require('./booking.routes');
const clinicRoutes = require('./clinic.routes');
const feedbackRoutes = require('./feedback.routes');
const slotRoutes = require('./slot.routes');
const suggestionRoutes = require('./suggestion.routes');
const noticeRoutes = require('./notice.routes');
const otpRoutes = require('./otp.routes');
const doctorRoutes = require('./doctor.routes');
const logsRoutes = require('./logs.routes');


routes.use('/users', userRoutes);
routes.use('/location', locationRoutes);
routes.use('/booking', bookingRoutes);
routes.use('/clinic', clinicRoutes);
routes.use('/feedback', feedbackRoutes);
routes.use('/slot', slotRoutes);
routes.use('/suggestion', suggestionRoutes);
routes.use('/notice', noticeRoutes);
routes.use('/otp', otpRoutes);
routes.use('/doctor', doctorRoutes);
routes.use('/log', logsRoutes);

routes.get('/', function (req, res) {
    res.status(200);
    res.json({
        success: true,
        message: 'Welcome to the coolest API on the earth!'
    });

});

module.exports = routes;
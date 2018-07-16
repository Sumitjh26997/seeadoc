const express = require('express');
const router = express.Router();
const Booking = require('../controllers/booking');

router.post('/add', Booking.addBooking);
router.post('/update', Booking.updateBooking);
router.post('/fetch', Booking.fetchBooking);
router.post('/delete', Booking.deleteBooking);
router.post('/cancel', Booking.cancelBooking);
router.post('/fetch-as-clinic', Booking.fetchAsClinic);
router.post('/fetch-as-patient', Booking.fetchAsPatient);
router.post('/change-status', Booking.changeStatus);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

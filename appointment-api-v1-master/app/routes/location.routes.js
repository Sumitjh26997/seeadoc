const express = require('express');
const router = express.Router();
const LocationCtrl = require('../controllers/location.ctrl');

router.post('/add', LocationCtrl.addLocation);
router.post('/update', LocationCtrl.updateLocation);
router.post('/fetch', LocationCtrl.fetchLocations);
router.post('/delete', LocationCtrl.deleteLocation);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

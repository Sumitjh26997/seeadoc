const express = require('express');
const router = express.Router();
const Slot = require('../controllers/slot');

router.post('/add', Slot.addSlot);
router.post('/update', Slot.updateSlot);
router.post('/fetch', Slot.fetchSlot);
router.post('/delete', Slot.deleteSlot);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

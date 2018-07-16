const express = require('express');
const router = express.Router();
const Notice = require('../controllers/notice');

router.post('/add', Notice.addNotice);
router.post('/update', Notice.updateNotice);
router.post('/fetch', Notice.fetchNotice);
router.post('/delete', Notice.deleteNotice);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

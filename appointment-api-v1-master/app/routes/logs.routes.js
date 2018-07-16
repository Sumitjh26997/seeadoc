const express = require('express');
const router = express.Router();
const LogsCtrl = require('../controllers/logs.ctrl');

router.post('/add', LogsCtrl.addLog);
router.post('/delete', LogsCtrl.deleteLog);
router.post('/fetch', LogsCtrl.getLogs);


router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

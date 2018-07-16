const express = require('express');
const router = express.Router();
const Feedback = require('../controllers/feedback');

router.post('/add', Feedback.addFeedback);
router.post('/update', Feedback.updateFeedback);
router.post('/fetch', Feedback.fetchFeedback);
router.post('/delete', Feedback.deleteFeedback);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

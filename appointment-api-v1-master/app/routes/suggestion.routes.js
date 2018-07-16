const express = require('express');
const router = express.Router();
const Suggestion = require('../controllers/suggestion');

router.post('/add', Suggestion.addSuggestion);
router.post('/update', Suggestion.updateSuggestion);
router.post('/fetch', Suggestion.fetchSuggestion);
router.post('/delete', Suggestion.deleteSuggestion);

router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

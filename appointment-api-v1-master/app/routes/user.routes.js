const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/login', UserController.login);
router.post('/signup', UserController.signUpUser);
router.post('/signin', UserController.signInUser);
router.post('/getuser', UserController.getUser);
router.post('/getallusers', UserController.getAllUsers);
router.post('/updateprofile', UserController.updateProfileUser);
router.post('/changepassword', UserController.changePasswordUser);
router.post('/forgotpassword', UserController.forgotPasswordUser);
router.get('/reset/:token', UserController.resetUser);
router.post('/reset-password/:token', UserController.resetPasswordUser);
router.post('/removeuser', UserController.removeUser);
router.post('/sendotp', UserController.sendOTP);
router.post('/verifyotp', UserController.verifyOTP);
router.post('/getmobileuser', UserController.getMobileUser);
router.post('/fetch', UserController.fetchUser);
router.post('/add-patient', UserController.addPatient);


router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Welcome to coolest api on the earth !'
    });
});

module.exports = router;

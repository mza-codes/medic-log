const express = require('express');
const authControllers = require('../controllers/authControllers');
const { otpAuth, otpVerify, otpVerifyV2, verifySession } = require('../controllers/twoFactorAuth');
const router = express.Router();
const jwtAuth = require('../middlewares/authorizeUser');

// @route - /api/v1/auth/
router.post('/otpAuth', otpAuth);
router.post('/otpAuth/otpVerify', otpVerifyV2);
router.route('/register').post(verifySession, authControllers.createAuth);
router.route('/login').post(authControllers.auth);
router.post('/logout', jwtAuth.checkAuthorization, authControllers.logout);
router.post('/refresh-token', jwtAuth.refreshToken);

router.route('/test2').get(jwtAuth.checkAuthorization, authControllers.updateAuth);
router.get('/test', authControllers.updateAuth);

// @route - /api/v1/auth/<id>
router.route('/:id')
    .put(jwtAuth.checkAuthorization, authControllers.updateAuth)
    .delete(jwtAuth.checkAuthorization, authControllers.removeAuth);

module.exports = router;
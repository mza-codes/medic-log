// const express = require('express');
const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const { otpAuth, otpVerifyV2, verifySession } = require('../controllers/twoFactorAuth');
const authorizeSession = require('../middlewares/authorizeUser');

// @route - /api/v1/auth/
router.post('/otpAuth', otpAuth);
router.post('/otpAuth/otpVerify', otpVerifyV2);
router.post('/register', verifySession, authControllers.createAuth);

router.post('/login', authControllers.auth);
router.get('/logout', authControllers.logout);

router.post('/logout', authorizeSession.checkAuthorization, authControllers.logout);
router.post('/refresh-token', authorizeSession.provideRefreshToken);

// @isToken Expired (check if request is valid)
router.get('/is-valid', authorizeSession.checkValidity);
// @get current user via cookie
router.get('/verifyUser', authorizeSession.checkCookie, authorizeSession.checkRefreshCookie, authControllers.provideUser);

// test routes !!
router.get('/test2', authorizeSession.checkAuthorization, authControllers.updateAuth);

router.get('/test', authControllers.updateAuth);

// @route - /api/v1/auth/<id>
router.route('/:id')
    .put(authorizeSession.checkAuthorization, authControllers.updateAuth)
    .delete(authorizeSession.checkAuthorization, authControllers.removeAuth);

module.exports = router;
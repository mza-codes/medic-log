import express from 'express';
import { otpAuth, otpVerifyV2, verifySession } from '../controllers/twoFactorAuth.js';
import {
    checkAuthorization,
    provideRefreshToken,
    checkValidity,
    checkCookie,
    checkRefreshCookie,
    refreshSession,
} from '../middlewares/authorizeUser.js';

import {
    createAuth,
    auth,
    logout,
    provideUser,
    updateAuth,
    removeAuth,
} from "../controllers/authControllers.js";

const router = express.Router();

// @route - /api/v1/auth/
router.post('/otpAuth', otpAuth);
router.post('/otpAuth/otpVerify', otpVerifyV2);
router.post('/register', verifySession, createAuth);

router.post('/login', auth);
router.get('/logout', logout);

router.post('/logout', checkAuthorization, logout);
// router.post('/refresh-token', provideRefreshToken);

// @refreshToken
router.post('/refresh-session', checkCookie, checkRefreshCookie, refreshSession);

// @isToken Expired (check if request is valid)
router.get('/is-valid', checkValidity);
// @get current user via cookie
router.get('/verifyUser', checkCookie, checkRefreshCookie, provideUser);

// test routes !!
router.get('/test2', checkAuthorization, updateAuth);

router.get('/test', updateAuth);

// @route - /api/v1/auth/<id>
router.route('/:id')
    .put(checkAuthorization, updateAuth)
    .delete(checkAuthorization, removeAuth);

export { router as authRoutes };
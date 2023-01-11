import express from 'express';
import { otpAuth, otpVerifyV2, verifySession } from '../controllers/twoFactorAuth.js';
import { forgotPassword } from '../controllers/userControllers.js';
import { isDBUser } from '../middlewares/isDBUser.js';
import {
    checkAuthorization,
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

/** @route - /api/v1/auth/ */
router.post('/otpAuth', otpAuth);
router.post('/otpAuth/otpVerify', otpVerifyV2);
router.post('/register', verifySession, createAuth);

router.post('/login', auth);
router.get('/logout', logout);

router.post('/logout', checkAuthorization, logout);
// router.post('/refresh-token', provideRefreshToken);

/** @refreshToken */
router.post('/refresh-session', refreshSession);

/** @isTokenExpired__UNUSED (check if request is valid) */
// router.get('/is-valid', checkValidity);

/** @get_current_user_via_cookie */
router.get('/verifyUser', checkCookie, checkRefreshCookie, provideUser);

router.put('/forgot-password', isDBUser, forgotPassword)  /** @placed in usercontrollers.js for clean code */

/** @route - /api/v1/auth/<id> @SEEMS_UNUSED */
router.route('/:id')
    .put(checkAuthorization, updateAuth)
    .delete(checkAuthorization, removeAuth);

export { router as authRoutes };
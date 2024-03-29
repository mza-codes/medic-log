import express from 'express';
import { checkCookie } from '../middlewares/authorizeUser.js';
import { updatePwdWAuth, updateUser } from '../controllers/userControllers.js';
import { verifyPwd } from '../middlewares/isDBUser.js';
import { verifyCSRF } from '../middlewares/authorizeCSRF.js';
import { preventUpdate } from '../middlewares/demoUser.js';

const router = express.Router();
router.use(checkCookie, verifyCSRF);

/** @route - /api/v1/user */
router.put("/update", preventUpdate, updateUser);
router.put("/update-password", verifyPwd, preventUpdate, updatePwdWAuth);

const userRoutes = router;
export default userRoutes;
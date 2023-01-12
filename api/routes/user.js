import express from 'express';
import { checkCookie } from '../middlewares/authorizeUser.js';
import { updatePwdWAuth, updateUser } from '../controllers/userControllers.js';
import { verifyPwd } from '../middlewares/isDBUser.js';

const router = express.Router();
router.use(checkCookie);

/** @route - /api/v1/user */
router.put("/update", updateUser);
router.put("/update-password", verifyPwd, updatePwdWAuth);

const userRoutes = router;
export default userRoutes;
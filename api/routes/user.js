import express from 'express';
import { checkCookie } from '../middlewares/authorizeUser.js';
import { updateUser } from '../controllers/userControllers.js';

const router = express.Router();
router.use(checkCookie);

/** @route - /api/v1/user */
router.get("/check", updateUser);
router.put("/update", updateUser);

const userRoutes = router;
export default userRoutes;
import express from 'express';
import { checkCookie } from '../middlewares/authorizeUser.js';
import { verifyCSRF } from '../middlewares/authorizeCSRF.js';
import { verifySuperAdmin } from '../middlewares/adminMiddleware.js';
import { getAllData } from '../controllers/adminControllers.js';

const router = express.Router();
router.use(checkCookie, verifyCSRF, verifySuperAdmin);

/** @route - /api/v1/super-user */
router.put("/get-data", getAllData);
// router.put("/update-data", );

const adminRoutes = router;
export default adminRoutes;
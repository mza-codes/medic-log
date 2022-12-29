import express from "express";
import { genDelTokenByPwd } from "../controllers/authControllers.js";
import {
    addPatient, getPatients, getPatient, updateRecord,
    getAllRecords, searchRecords, deleteRecord
} from "../controllers/patientRecords.js";
import { verifyDelToken } from "../middlewares/authDelToken.js";
import { checkCookie } from "../middlewares/authorizeUser.js";

const router = express.Router();

// @route - /api/v1/app 
router.post('/add-data', checkCookie, addPatient);
router.get('/get-records', checkCookie, getPatients);
router.get('/get-record/:id', checkCookie, getPatient);
router.put('/update-record/:id', checkCookie, updateRecord);
router.get('/search-records/?', checkCookie, searchRecords);

// @routes related to Deletion
router.post('/delete-record/:id/authenticate', checkCookie, genDelTokenByPwd);
router.delete('/delete-record/:id', checkCookie, verifyDelToken, deleteRecord);

// @Override
router.get('/get-all-records', checkCookie, getAllRecords);

// export { router as recordRoutes };
export default router;
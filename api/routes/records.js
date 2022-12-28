import express from "express";
import {
    addPatient, getPatients, getPatient, updateRecord,
    getAllRecords, searchRecords, deleteRecord
} from "../controllers/patientRecords.js";
import { checkCookie, verifyPassword } from "../middlewares/authorizeUser.js";
// import { verifyHex } from "../middlewares/verifyHex.js";

const router = express.Router();

// @route - /api/v1/app 
router.post('/add-data', checkCookie, addPatient);
router.get('/get-records', checkCookie, getPatients);
router.get('/get-record/:id', checkCookie, getPatient);
router.put('/update-record/:id', checkCookie, updateRecord);
router.get('/search-records/?', checkCookie, searchRecords);
router.patch('/delete-record/:id', checkCookie, verifyPassword, deleteRecord);

// @Override
router.get('/get-all-records', checkCookie, getAllRecords);

// export { router as recordRoutes };
export default router;
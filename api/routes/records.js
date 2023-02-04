import express from "express";
import { genDelTokenByPwd } from "../controllers/authControllers.js";
import {
    addPatient, getPatients, getPatient, updateRecord,
    getAllRecords, searchRecords, deleteRecord, searchRecordsV2
} from "../controllers/patientRecords.js";
import { verifyDelToken } from "../middlewares/authDelToken.js";
import { verifyCSRF } from "../middlewares/authorizeCSRF.js";
import { checkCookie } from "../middlewares/authorizeUser.js";

const router = express.Router();
router.use(checkCookie, verifyCSRF);
// @route - /api/v1/app 
router.post('/add-data', addPatient);
router.get('/get-records', getPatients);
router.get('/get-record/:id', getPatient);
router.put('/update-record/:id', updateRecord);
router.get('/search-records/?', searchRecords);
router.get('/search-records-v2/?', searchRecordsV2);

// @routes related to Deletion
router.put('/delete-record/:id/authenticate', genDelTokenByPwd);
router.delete('/delete-record/:id', verifyDelToken, deleteRecord);

// @Override
router.get('/get-all-records', getAllRecords);

// export { router as recordRoutes };
export default router;
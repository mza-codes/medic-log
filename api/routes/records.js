import express from "express";
import { addPatient, getPatients, getPatient, updateRecord, getAllRecords, searchRecords } from "../controllers/patientRecords.js";
import { checkCookie } from "../middlewares/authorizeUser.js";

const router = express.Router();

// @route - /api/v1/app 
router.post('/add-data', checkCookie, addPatient);
router.get('/get-records', checkCookie, getPatients);
router.get('/get-record/:id', checkCookie, getPatient);
router.put('/update-record/:id', checkCookie, updateRecord);
router.get('/search-records/?', checkCookie, searchRecords);

// @Override
router.get('/get-all-records', checkCookie, getAllRecords);

export { router as recordRoutes };
const { addPatient, getPatients, getPatient, updateRecord, getAllRecords } = require("../controllers/patientRecords");
const { checkCookie } = require("../middlewares/authorizeUser");

const router = require("express").Router();
// const express = require("express");
// const router = express.Router();

// @route - /api/v1/app 
router.post('/add-data', checkCookie, addPatient);
router.get('/get-records', checkCookie, getPatients);
router.get('/get-record/:id', checkCookie, getPatient);
router.put('/update-record/:id',checkCookie, updateRecord);

// @Override
router.get('/get-all-records',checkCookie,getAllRecords);

module.exports = router;
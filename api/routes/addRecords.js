const { addPatient } = require("../controllers/patientRecords");
const { checkCookie } = require("../middlewares/authorizeUser");

const router = require("express").Router();
// const express = require("express");
// const router = express.Router();

// @route - /api/v1/app 
router.post('/add-data', checkCookie, addPatient);

module.exports = router;
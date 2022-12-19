const asyncHandler = require("../middlewares/asyncHandler");
const Patient = require("../models/Patient");
const { log } = require("../utils/logger");

exports.addPatient = asyncHandler(async (req, res) => {
    const data = req?.body;
    if (!data) return res.status(400).json({ success: false, message: "No Data Found !" });
    // const newData = await Patient.create(data);
    const newData = data;
    log.warn("One Patient Created Successfully", newData);
    return res.status(200).json({ success: true, message: "Data Added Successfully", patient: newData });
});

// @ another method
// const newData = new Patient(data);
// newData.save();
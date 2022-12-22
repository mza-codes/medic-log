const asyncHandler = require("../middlewares/asyncHandler");
const Patient = require("../models/Patient");
const { log } = require("../utils/logger");

function* generateId() {
    let i = 0;
    while (true) {
        yield i++;
    };
};

exports.addPatient = asyncHandler(async (req, res) => {
    const data = req?.body;
    if (!data) return res.status(400).json({ success: false, message: "No Data Found !" });
    data.owner = req.userId;
    const newData = await Patient.create(data);
    return res.status(200).json({ success: true, message: "Data Added Successfully" });
});

exports.getPatients = asyncHandler(async (req, res) => {
    const data = await Patient.find({ owner: req.userId });
    log.error("Fethed Data", data);
    return res.status(200).json({ success: true, records: data });
});

exports.getPatient = asyncHandler(async (req, res) => {
    const recordId = req?.params?.id;
    if (!recordId) return res.status(404).json({ success: false, message: `Record Id must be passed in params` });
    const data = await Patient.findById(recordId);
    return res.status(200).json({ success: true, record: data });
});

exports.updateRecord = asyncHandler(async (req, res) => {
    const data = req?.body;
    const recordId = req?.params?.id;
    console.log("UpdateRecord Route", data);
    if (!data || !recordId) return res.status(400).json({ success: false, message: "No Data Provided to Update!" });
    const newData = await Patient.findByIdAndUpdate(recordId, { $push: { lastCheckup: data.lastCheckup }, $addToSet: { ...data } });

});

// @ another method
// const newData = new Patient(data);
// newData.save();
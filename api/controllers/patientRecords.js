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
    // data.checkups = [data.lastCheckup];
    data.owner = req.userId;
    const newData = await Patient.create(data);
    return res.status(200).json({ success: true, message: "Data Added Successfully", record: newData });
});

exports.getPatients = asyncHandler(async (req, res) => {
    const data = await Patient.find({ owner: req.userId });
    log.error("Fethed Data", data);
    return res.status(200).json({ success: true, records: data });
});

exports.getPatient = asyncHandler(async (req, res) => {
    const recordId = req?.params?.id;
    if (!recordId) return res.status(404).json({
        success: false,
        message: `Record Id must be passed in params`
    });
    const data = await Patient.findById(recordId);
    return res.status(200).json({ success: true, record: data });
});

exports.updateRecord = asyncHandler(async (req, res) => {
    if (!req.body || !req?.params?.id) return res.status(400).json({ success: false, message: "No Data Provided to Update!" });
    const { lastCheckup, ...data } = req.body;
    const recordId = req?.params?.id;
    let newData = await Patient.findByIdAndUpdate(recordId, { $push: { lastCheckup }, ...data }, { new: true });
    // newData = await Patient.findByIdAndUpdate(recordId, data, { new: true });

    return res.status(200).json({ success: true, message: "complete", record: newData });
});

// @Overrides testing
exports.getAllRecords = asyncHandler(async (req, res) => {
    const data = await Patient.find({});
    return res.status(200).json({ success: true, records: data });
});

// @ mongoose save alternate method
// const newData = new Patient(data);
// newData.save();
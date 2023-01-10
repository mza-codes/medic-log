import asyncHandler from "../middlewares/asyncHandler.js";
import Patient from "../models/Patient.js";
import { log } from "../utils/logger.js";
import { redisClient } from "../utils/redisConfig.js";
import { deleteReqCookie } from "./authControllers.js";

// function* generateId() {
//     let i = 0;
//     while (true) {
//         yield i++;
//     };
// };

export const validateStr = {
    isNum: /^\d+\.?\d*$/,
    isWord: /^[a-zA-Z][a-zA-Z ]*$/,
    // isNumDep: /^[0-9][A-Za-z0-9 -]*$/,
    // localPattern: /^[0-9]*$/,
};

export const addPatient = asyncHandler(async (req, res) => {
    const data = req?.body;
    if (!data) return res.status(400).json({ success: false, message: "No Data Found !" });
    // data.checkups = [data.lastCheckup];
    data.owner = req.userId;
    const newData = await Patient.create(data);
    return res.status(200).json({ success: true, message: "Data Added Successfully", record: newData });
});

export const getPatients = asyncHandler(async (req, res) => {
    const data = await Patient.find({ owner: req.userId });
    log.error("Fethed Data", data);
    return res.status(200).json({ success: true, records: data });
});

export const getPatient = asyncHandler(async (req, res) => {
    const recordId = req?.params?.id;
    if (!recordId) return res.status(404).json({
        success: false,
        message: `Record Id must be passed in params`
    });
    const data = await Patient.findById(recordId);
    return res.status(200).json({ success: true, record: data });
});

export const updateRecord = asyncHandler(async (req, res) => {
    if (!req.body || !req?.params?.id) return res.status(400).json({ success: false, message: "No Data Provided to Update!" });
    const { lastCheckup, ...data } = req.body;
    const recordId = req?.params?.id;
    let newData = await Patient.findByIdAndUpdate(recordId, { $push: { lastCheckup }, ...data }, { new: true });
    // newData = await Patient.findByIdAndUpdate(recordId, data, { new: true });

    return res.status(200).json({ success: true, message: "complete", record: newData });
});

// @Overrides testing
export const getAllRecords = asyncHandler(async (req, res) => {
    // let data = await redisClient.get("all-records");
    let data;
    if (!data) {
        log.warn("Fetching ALL RECORDS from SERVER");
        data = await Patient.find({});
        redisClient.set("all-records", JSON.stringify(data));
    };
    // data = JSON.parse(data);
    data && log.info("fetched from Cache");
    return res.status(200).json({ success: true, records: data });
});

export const searchRecords = asyncHandler(async (req, res) => {
    let { query } = req?.query;
    if (!query) return res.status(404).json({ success: false, message: "Invalid Query" });

    log.error("Major isValidNumber", query, "===", validateStr.isNum.test(query));
    log.error("Major isValidWord", query, "===", validateStr.isWord.test(query));

    let records = [];
    if (validateStr.isNum.test(query)) {
        log.error("Validated to Number");
        const value = parseInt(query);
        records = await Patient.find({ age: { $gte: value } }).sort({ age: 1 });
    }
    // if (validateStr.isWord.test(query)) 
    else {
        log.error("Validated to Word");
        const q = { $regex: query, $options: "$i" };
        records = await Patient.find({
            $or: [
                { name: q },
                { city: q },
                { document: q }
            ]
        });
    };

    if (records.length <= 0) return res.status(404).json({ success: false, message: `No Results found for Query "${query}"` });
    log.info("REQUEST COMPLETED !!");
    res.status(200).json({ success: true, message: `Results for "${query}"`, records });
});

export const searchRecordsV2 = asyncHandler(async (req, res) => {
    const query = req?.query;
    let qValue = "value";
    console.log(query);

    if (!query) return res.status(404).json({ success: false, message: "Invalid Query" });

    let records = [];

    if (query?.age) {
        qValue = query?.age['$gte'] ?? query?.age['$lte'];
        records = await Patient.find(query).sort(query?.sort);
    } else if (query?.lastCheckup) {
        const { lastCheckup, sort } = query;
        qValue = query?.lastCheckup;
        const q = { lastCheckup: { $regex: lastCheckup, $options: "$i" } };
        records = await Patient.find(q).sort(sort);
    } else {
        const { field, value } = query;
        qValue = value;
        const q = { $regex: value, $options: "$i" };
        records = await Patient.find({ [field]: q }).sort(query?.sort);
    };

    if (records.length <= 0) {
        return res.status(404).json({
            success: false,
            message: `No Results found for Query "${qValue}"`
        });
    };
    log.info("REQUEST COMPLETED !!");
    res.status(200).json({ success: true, message: `Results for "${qValue}"`, records });
});

export const deleteRecord = asyncHandler(async (req, res) => {
    let { id } = req.params;
    const status = await Patient.findByIdAndDelete(id);
    console.warn("Record WITH ID: ", id, " Deleted SUCCESSFULLY", status);
    res.clearCookie(deleteReqCookie);
    req.cookies[deleteReqCookie] = "";
    res.status(200).json({ success: true, message: `Deleted Patient with ID: ${id}`, status });
});

// @ mongoose save alternate method
// const newData = new Patient(data);
// newData.save();
import asyncHandler from "../middlewares/asyncHandler.js";
import Otp from "../models/OTP.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import genRes from "../utils/JSONResponse.js";

export const getAllData = asyncHandler(async (req, res, next) => {
    const users = await User.find({}).sort({ "createdAt": -1 });
    const records = await Patient.find({}).sort({ "createdAt": -1 });
    const otps = await Otp.find().sort({ "createdAt": -1 });

    return genRes(res, 200, true, "Fetched All Data from Server!", { users, records, otps });
});
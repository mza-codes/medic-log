import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import genRes from "../utils/JSONResponse.js";
import { log } from "../utils/logger.js";

export const checkRoute = asyncHandler(async (req, res, next) => {
    log.info("Checkroute");
    return res.status(200).json({ success: true, message: "complete" });
});

export const updateUser = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    if (!req.body)
        return res.status(400).json({
            success: false,
            message: "No Data Provided to Update!"
        });

    const newData = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    const { password, createdAt, updatedAt, __v, ...user } = newData._doc;
    return genRes(res, 200, true, "User Name Updated", { user });
});
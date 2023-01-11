import { } from "dotenv/config";
import { sendEmail } from "../config/nodemailer.js";
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

export const forgotPassword = asyncHandler(async (req, res, next) => {
    log.info("@@ ForgotPWD Route");

    const otp = otpGenerator.generate(6, { digits: true });
    const content = `Your OTP for Registration is ${otp}. This OTP will Expire in 5 Minutes`;
    await sendEmail(req.email, `OTP Verification from ${process.env.BRAND ?? "mza_Node Server"}`, content);

    return genRes(res, 200, true,
        `OTP has Successfully sent to ${req.email}`);
});

export const verifyOTPFGPwd = asyncHandler(async (req, res, next) => {
    log.info("@@ verifyOTPFGPwd Route");
    const otp = req?.body?.otp;
    // case need s completetion,implement redis cache
    return genRes(res,200)
});
import { } from "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { sendEmail } from "../config/nodemailer.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import { genCookie } from "../utils/authUtils.js";
import genRes from "../utils/JSONResponse.js";
import { log } from "../utils/logger.js";
import otpGenerator from "../utils/otpGenerator.js";
import { redisClient } from "../utils/redisConfig.js";

const changePwdCookie = "__sa_authorized";

export const checkRoute = asyncHandler(async (req, res) => {
    log.info("Checkroute");
    return res.status(200).json({ success: true, message: "complete" });
});

export const updateUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    if (!req.body)
        return res.status(400).json({
            success: false,
            message: "No Data Provided to Update!"
        });

    const newData = await User.findByIdAndUpdate(req.userId, { ...req.body, $inc: { "changeCount.name": 1 } }, { new: true });
    const { password, createdAt, updatedAt, __v, ...user } = newData._doc;
    console.log(newData);
    return genRes(res, 200, true, "User Name Updated!", { user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    log.info("@@ ForgotPWD Route");

    const otp = otpGenerator.generate(6, { digits: true });
    const content = `Your OTP for Registration is ${otp}. This OTP will Expire in 5 Minutes`;
    await redisClient.set(req.email, otp);
    // await sendEmail(req.email, `OTP Verification from ${process.env.BRAND ?? "mza_Node Server"}`, content);
    log.info("Expose OTP: ", otp);
    return genRes(res, 200, true,
        `OTP has Successfully sent to ${req.email}`);
});

export const verifyOTPforPwd = asyncHandler(async (req, res) => {
    const { otp, email } = req?.body;
    if (!otp || !email) return genRes(res, 400, false,
        `${!email ? "Email not found on request!" : "Invalid OTP!"}`);

    const validOTP = await redisClient.get(email);
    const status = parseInt(otp) === parseInt(validOTP);

    if (status === true) {
        const token = jwt.sign({ email: email }, process.env.JWT_REFRESH_KEY, { expiresIn: "5m" });
        genCookie(res, changePwdCookie, token, {
            expires: new Date(Date.now() + (1000 * 60) * 5)
        });
        await redisClient.del(email);
        return genRes(res, 200, true, "OTP Verified");
    };
    return genRes(res, 400, false, "Incorrect OTP!");
});

export const updatePwd = asyncHandler(async (req, res) => {
    const authToken = req?.cookies?.[changePwdCookie];
    const { password } = req?.body;
    if (!authToken || !password) {
        let msg = `${!password ? "Password not found on request!"
            : "Not Authorized to Update Password!"}`;
        return genRes(res, 400, false, msg);
    };
    try {
        const payload = jwt.verify(authToken, process.env.JWT_REFRESH_KEY);
    } catch (error) {
        return genRes(res, 401, false, "User Not Authorized or Session Expired");
    };

    console.log("Verified Token");
    const dbUser = req.currentUser;
    const status = await dbUser.comparePwd(password);
    if (status) return genRes(res, 406, false, "New Password Cannot be Old Password");

    dbUser.password = password;
    await dbUser.save();
    res.clearCookie(changePwdCookie);
    req.cookies[changePwdCookie] = "";
    return genRes(res, 200, true, "Password Updated!");
});

export const updatePwdWAuth = asyncHandler(async (req, res) => {
    const { password } = req?.body;
    if (!password) return genRes(res, 400, false, "New Password not found on request!");
    const user = req.currentUser;
    const status = await user.comparePwd(password);
    if (status) return genRes(res, 406, false, "New Password Cannot be Old Password");
    user.password = password;
    await user.save();
    return genRes(res, 200, true, "Password Updated Successfully!");
});
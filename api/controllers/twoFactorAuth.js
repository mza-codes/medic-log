import { } from 'dotenv/config';
import bcrypt from "bcrypt";
import colors from "colors";
import jwt from "jsonwebtoken";

import { sendEmail } from "../config/nodemailer.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Otp from "../models/OTP.js";
import { log } from "../utils/logger.js";
import otpGenerator from "../utils/otpGenerator.js";
import genRes from '../utils/JSONResponse.js';
import { cookieConfig } from '../utils/authUtils.js';

export const otpCookie = "OTP_Session";
export const verifiedCookie = "isVerified";

export const otpAuth = asyncHandler(async (req, res, next) => {
    const email = req.email;
    if (req.userStat) {
        return genRes(res, 406, false, "User Already Exists");
    };

    const currentDate = new Date();
    const expiry = new Date(currentDate.getTime() + 5 * 60000);
    const otp = otpGenerator.generate(6, { digits: true });
    const encoded = await bcrypt.hash(otp, 15);
    const content = `Your OTP for Registration is ${otp}. This OTP will Expire in 5 Minutes`;
    const otpStatus = await Otp.create({ value: encoded, expireAt: expiry, email: email });
    const id = otpStatus._id;

    const token = jwt.sign({ otpId: id, email }, process.env.JWT_KEY, { expiresIn: "5m" });
    if (req.cookies) {
        log.warn("OLD COOKIE Found!");
        res.clearCookie(otpCookie, cookieConfig);
        req.cookies[otpCookie] = "";
    };
    res.cookie(String(otpCookie), token, {
        ...cookieConfig,
        expires: new Date(Date.now() + (1000 * 60) * 5),
    });
    log.warn(colors.green("Exposing OTP: ", otp));
    await sendEmail(email, `OTP Verification from ${process.env.BRAND ?? "mza_Node Server"}`, content);
    return res.status(200).json({ success: true, message: `OTP has Successfully sent to ${email}` });
});

export const otpVerifyV2 = asyncHandler(async (req, res, next) => {
    const otp = req.body?.otp;
    if (!otp) return res.status(406).json({ success: false, message: 'Invalid OTP' });

    const token = req.cookies[otpCookie];
    if (!token) return res.status(401).json({ success: false, message: 'Unable to verify request,Invalid Session' });

    let data = jwt.verify(token, process.env.JWT_KEY);
    const otpData = await Otp.findOne({ _id: data.otpId }); /** @failure_Prevention */
    if (!otpData) return genRes(res, 403, false, "Altered Values found in your cookie,Invalid Session");

    const status = await bcrypt.compare(String(otp), otpData.value);
    if (status === true) {
        // clear previous cookies
        res.clearCookie(otpCookie, cookieConfig);
        req.cookies[otpCookie] = "";

        // issues new token for re verification
        const newToken = jwt.sign({ otpId: data.otpId, email: data.email }, process.env.JWT_KEY, { expiresIn: "4m" });
        await Otp.findByIdAndUpdate(otpData._id, { verified: true });
        log.info("OTP Updated to verified");
        res.cookie(String(verifiedCookie), newToken, {
            ...cookieConfig,
            expires: new Date(Date.now() + (1000 * 60) * 4),
        });
        return res.status(200).json({ success: true, message: "OTP Verification Success" });
    };
    return res.status(401).json({ success: false, message: "Incorrect OTP" });
});

export const verifySession = asyncHandler(async (req, res, next) => {
    log.warn("Verifiying USER Session 2FA");
    const token = req.cookies[verifiedCookie];
    if (!token) return genRes(res, 401, false, 'Unable to verify request,OTP verified information not found!');

    let data = jwt.verify(token, process.env.JWT_KEY);
    const isValidEmail = data?.email === req?.body?.email;

    if (!isValidEmail) return genRes(res, 403, false, `OTP Unverified for ${req?.body?.email}`);
    const otpData = await Otp.findOne({ _id: data.otpId });
    if (!otpData) return genRes(res, 500, false, "No OTP Verified Information found!");

    log.warn("Status of OTP Verified", otpData?.verified);
    if (!otpData?.verified) return res.status(401).json({ success: false, message: "OTP not verified,Please try again!" });

    if (token && otpData?.verified) {
        log.info("Session OK, Proceed to Register");
        next();
        return;
    };
    return res.status(500).json({ success: false, message: "OTP ReVerification Error !" });
});

/** 
 * @param { UNUSED functions }
export const otpVerify = asyncHandler(async (req, res, next) => {
    
    const otp = req.body?.otp;
    if (!otp) return res.status(406).json({ success: false, message: 'Invalid OTP' });
    const cookie = req.headers.cookie;
    log.info(cookie, "<>", req.cookies);
    if (!cookie?.includes(otpCookie)) {
        return res.status(401).json({ success: false, message: 'Unable to verify user session,No Token Found' });
    };

    const token = cookie?.split(`${otpCookie}=`)[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unable to verify user session,Invalid Token' }); // To Prevent Failure

    const data = jwt.verify(token, process.env.JWT_KEY);
    const otpData = await Otp.findOne({ _id: data.otpId });
    if (!otpData) return res.status(403).json({ succes: false, message: "Altered Values found in your cookie,Invalid Session" });

    const status = await bcrypt.compare(String(otp), otpData.value);
    if (status === true) {
        res.clearCookie(otpCookie,cookieConfig);
        req.cookies[otpCookie] = "";
        return res.status(200).json({ success: true, message: "OTP Verification Success" });
    };
    return res.status(401).json({ success: false, message: "Incorrect OTP" });
}); */
require("dotenv").config();
const { sendEmail } = require("../config/nodemailer");
const colors = require("colors");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Otp = require("../models/OTP");
const { log } = require("../utils/logger");
const { generate } = require("../utils/otpGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpCookie = "OTP_Session";

exports.otpAuth = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    if (!email) return res.status(406).json({ success: false, message: 'Invalid Email' });

    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser || duplicateUser !== null) {
        return res.status(406).json({ success: false, message: 'User Already Exists, Please Login' });
    };

    const currentDate = new Date();
    const expiry = new Date(currentDate.getTime() + 5 * 60000);
    const otp = generate(6, { digits: true });
    const encoded = await bcrypt.hash(otp, 15);
    const content = `Your OTP for Registration is ${otp}. This OTP will Expire in 5 Minutes`;
    const otpStatus = await Otp.create({ value: encoded, expiredAt: expiry });
    const id = otpStatus._id;

    const token = jwt.sign({ otpId: id }, process.env.JWT_KEY, { expiresIn: "5m" });
    if (req.cookies) {
        log.warn("OLD COOKIE Found!");
        res.clearCookie(otpCookie);
        req.cookies[otpCookie] = "";
    };
    res.cookie(String(otpCookie), token, {
        path: "/",
        expiry: new Date(Date.now() + (1000 * 60) * 5),
        httpOnly: true,
        sameSite: "lax"
    });
    log.warn(colors.green("Exposing OTP: ", otp));
    // await sendEmail(email, `OTP Verification from ${process.env.Brand ?? "mza_Node Server"}`, content);
    return res.status(200).json({ success: true, message: `OTP has Successfully sent to ${email}` });
});

exports.otpVerify = asyncHandler(async (req, res, next) => {
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
        res.clearCookie(otpCookie);
        req.cookies[otpCookie] = "";
        return res.status(200).json({ success: true, message: "OTP Verification Success" });
    };
    return res.status(401).json({ success: false, message: "Incorrect OTP" });
});

exports.otpVerifyV2 = asyncHandler(async (req, res, next) => {
    const otp = req.body?.otp;
    if (!otp) return res.status(406).json({ success: false, message: 'Invalid OTP' });

    const token = req.cookies[otpCookie];
    if (!token) return res.status(401).json({ success: false, message: 'Unable to verify user session,Invalid Token' });

    let data = jwt.verify(token, process.env.JWT_KEY);
    const otpData = await Otp.findOne({ _id: data.otpId });
    if (!otpData) return res.status(403).json({ succes: false, message: "Altered Values found in your cookie,Invalid Session" });

    const status = await bcrypt.compare(String(otp), otpData.value);
    if (status === true) {
        res.clearCookie(otpCookie);
        req.cookies[otpCookie] = "";
        return res.status(200).json({ success: true, message: "OTP Verification Success" });
    };
    return res.status(401).json({ success: false, message: "Incorrect OTP" });
});
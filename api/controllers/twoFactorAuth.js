const { sendEmail } = require("../config/nodemailer");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const { log } = require("../utils/logger");
const { generate } = require("../utils/otpGenerator");

exports.otpAuth = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const duplicateUser = await User.findOne({ email: email });
    const currentDate = new Date();

    if (duplicateUser || duplicateUser !== null) {
        return res.status(406).json({ success: false, message: 'User Already Exists, Please Login' });
    };

    const expiry = new Date(currentDate.getTime() + 10 * 60000);
    let otp = generate(6, { digits: true });
    const content = `Your OTP for Registration is ${otp}. This OTP will Expire in 10 Minutes`;
    // await sendEmail(email, `OTP Verification from ${process.env.Brand}`, content);
    return res.status(200).json({ success: true, message: `OTP has Successfully sent to ${email}.` });
});

exports.otpVerify = asyncHandler(async (req, res, next) => {
    const otp = req.body?.otp;

});
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    value: { type: String, required: [true, "OTP is a Required Field"] },
    expiredAt: { type: Date, required: [true, "Email Required "] },
    verified: { type: Boolean, default: false }
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
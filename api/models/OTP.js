import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    value: { type: String, required: [true, "OTP is a Required Field"] },
    expiredAt: { type: Date, required: [true, "Email Required "] },
    verified: { type: Boolean, default: false },
    email: { type: String, required: [true, "Email Required to create OTP"] },

}, {
    timestamps: true,
    expireAfterSeconds: new Date(Date.now) + (1000 * 60) * 6
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
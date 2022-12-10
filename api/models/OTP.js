const { default: mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
    value: { type: String, required: [true, "OTP is a Required Field"] },
    expiredAt: { type: Date, required: [true, "Email Required "] },
    verified: { type: Boolean }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
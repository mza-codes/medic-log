const { default: mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
    value: { type: String, required: [true, "OTP is a Required Field"] },
    expiredAt: { type: Date, required: [true, "Email Required "] },
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    value: { type: String, required: [true, "OTP is a Required Field"] },
    expireAt: { type: Date, required: [true, "ExpireAt field Required "] },
    verified: { type: Boolean, default: false },
    email: { type: String, required: [true, "Email Required to create OTP"] },
});

const Otp = mongoose.model('Otp', otpSchema);

// Otp.createIndexes({ "expireAt": 1, expireAfterSeconds: 0 });
/** db.log_events.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } ) */

export default Otp;
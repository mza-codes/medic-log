import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User required for session"]
    },
    isValid: { type: Boolean, default: false }
}, {
    timestamps: true,
    expireAfterSeconds: new Date(Date.now) - (1000 * 60) * 60
});

const Session = mongoose.model("session", sessionSchema);

export default Session;
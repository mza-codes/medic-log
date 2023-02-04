import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User required for session"]
    },
    sessions: {
        type: {
            auth: String,
            csrf: String
        },
        default: {
            auth: null,
            csrf: null
        }
    }
}, {
    timestamps: true,
});

/** @param { capped:true } optional */

const Session = mongoose.models?.Session ?? mongoose.model("session", sessionSchema);
export default Session;

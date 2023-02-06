import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, "Key is Required !!"],
        unique: [true, "Key must be Unique !!"]
    },
    value: {

    }
}, {
    timestamps: true,
});

/** @param { capped:true } optional */

const Session = mongoose.models?.Session ?? mongoose.model("session", sessionSchema);
export default Session;

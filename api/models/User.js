import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, "Email Required "], unique: [true, "Email must be Unique"] },
    password: { type: String, required: [true, "Password Required "] },
    name: { type: String, required: [true, "Name Required"] },
    verified: { type: Boolean, default: false },
    // country: { type: String, required: [true, "Required"] },
    // age: { type: Number, required: [true, "Required"] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
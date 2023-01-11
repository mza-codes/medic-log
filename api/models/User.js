import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, "Email Required "], unique: [true, "Email must be Unique"] },
    password: { type: String, required: [true, "Password Required "] },
    name: { type: String, required: [true, "Name Required"] },
    verified: { type: Boolean, default: false },
    // country: { type: String, required: [true, "Required"] },
    // age: { type: Number, required: [true, "Required"] }
}, { timestamps: true });

/** @Arrow_Functions does not have (this) property. */

userSchema.methods.isValidPwd = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: [true, "Email Required "], unique: [true, "Email must be Unique"] },
    password: { type: String, required: [true, "Password Required "] },
    name: { type: String, required: [true, "Name Required"] },
    verified: { type: Boolean, default: false },
    pwdChangeCount: { type: Number, default: 0 }
    // country: { type: String, required: [true, "Required"] },
    // age: { type: Number, required: [true, "Required"] }
}, { timestamps: true });

/** @Arrow_Functions does not have (this) property. */
// Not working
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 15);
    this.pwdChangeCount += 1;
    next();
});

userSchema.methods.isValidPwd = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
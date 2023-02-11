import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email Required "],
        unique: [true, "Email must be Unique"]
    },
    password: {
        type: String,
        required: [true, "Password Required "]
    },
    name: {
        type: String,
        required: [true, "Name Required"]
    },
    verified: {
        type: Boolean,
        default: false
    },
    changeCount: {
        type: Object,
        default: { password: -1, email: 0, name: 0 }
    },
    superAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

/** @use {select:false} to unload the field */
/** @Arrow_Functions does not have (this) property. */

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 15);
    this.changeCount.password += 1;
    next();
});

userSchema.methods.comparePwd = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
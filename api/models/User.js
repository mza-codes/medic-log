const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Required"] },
    email: { type: String, required: [true, "Required "], unique: [true, "Required"] },
    password: { type: String, required: [true, "Required "] },
    country: { type: String, required: [true, "Required"] },
    age: { type: Number, required: [true, "Required"] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
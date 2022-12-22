const { default: mongoose } = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is a required field !"], },
    age: { type: Number, required: [true, "Age is a required field !"], },
    city: { type: String, required: [true, "City is a required field !"], },
    lastCheckup: { type: Array, required: [true, "LastCheckup Date is a required field !"], },
    document: { type: String, required: [true, "Patient Document is a required field !"], },
    owner: { type: String, required: [true, "Owner ID Required while adding Patient"] }

}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
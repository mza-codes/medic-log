require("dotenv").config();
const nodemailer = require("nodemailer");
const { log } = require("../utils/logger");

const sender = process.env.NODEMAILER;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: sender,
        pass: process.env.MAILER_PASSWORD
    }
});

// disabled while testing  
exports.testConnection = () => {
    transporter.verify((err, success) => {
        if (err) { log.error("Error Connecting Mailer", err); process.exit(0); }
        if (success) {
            log.info("Nodemailer Connection Success!");
            log.info("Assigned Sender: ", sender);
        } else {
            log.info("transporter received no error & success, refer here");
            return true;
        };
    });
};

// Sample Mail 
// const body = {
//     from: sender, // sender address
//     to: "lock@ggth.lop", // list of receivers
//     subject: "Hello ✔ this is from node server", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
// };

exports.sendEmail = async (to, subject, body) => {

    try {
        const mail = {
            from: sender,
            to,
            subject,
            text: body
        };
        await transporter.sendMail(mail);
        log.warn("One Email Successfully Sent to: " + to);
        return true;
    } catch (err) {
        log.error("Error Sending Email to: " + to);
        log.error(err);
        return process.exit();
    };
};

// module.exports = { transporter, sendEmail, testConnection };
exports.transporter = transporter;
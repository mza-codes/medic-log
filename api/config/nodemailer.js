import nodemailer from "nodemailer";
import ENV from "../utils/validateEnv.js";
import { log } from "../utils/logger.js";

const sender = ENV.NODEMAILER;

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: sender,
        pass: ENV.MAILER_PASSWORD
    }
});

// disabled while testing  
export const testConnection = () => {
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

// (() => {
//     transporter.verify((err, success) => {
//         if (err) { log.error("Error Connecting Mailer", err); process.exit(0); }
//         if (success) {
//             log.info("Nodemailer Connection Success!");
//             log.info("Assigned Sender: ", sender);
//         } else {
//             log.info("transporter received no error & success, refer here");
//             return true;
//         };
//     });
// })();
/** @param {Immediately invoked function expressions} */

// Sample Mail 
// const body = {
//     from: sender, // sender address
//     to: "lock@ggth.lop", // list of receivers
//     subject: "Hello ✔ this is from node server", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
// };

export const sendEmail = async (to, subject, body) => {
    if (ENV.isDevelopment) return true;

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

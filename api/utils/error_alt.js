import { log } from "./logger.js";

const sendError = (err, req, res, next) => {
    log.error("ERROR V2: ", err);
    let errMsg = "An Unknown Error Occured!";
    if (err instanceof Error) errMsg = err.message;
    return res.status(500).json({
        success: false,
        message: errMsg
    });
};

/** @define_in_app app.use(sendError) {place at the bottom} */

export default sendError;
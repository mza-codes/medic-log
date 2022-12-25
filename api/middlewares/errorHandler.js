import ErrorResponse from '../utils/errorResponse.js';
import { log } from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    log.error('ERROR OCCURED !!!');
    log.error(err);

    let error = { ...err }
    error.message = err.message

    if (err.message === "CastError") {
        const message = 'Resource Not Found';
        err = new ErrorResponse(message, 404);
    };

    if (err.code === 11000) {
        const message = 'Duplicate Field Value Entered'
        err = new ErrorResponse(message, 400);
    };

    if (err.message === "ValidationError") {
        log.error("Validation Error", err);
        const message = Object.values(err.errors).map(error => error.message).join(', ');
        err = new ErrorResponse(message, 400);
    };

    // add more Cases! this is just basics!

    return res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

export default errorHandler;
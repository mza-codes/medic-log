const ErrorResponse = require('../utils/errorResponse');
const { log } = require('../utils/logger');

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
        err = new ErrorResponse(message, 400)
    };

    if (err.message === "ValidationError") {
        const message = Object.values(err.errors).map(error => error.message).join(', ');
        err = new ErrorResponse(message, 400)
    };

    // add more Cases! this is just basics!

    res.status(err.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
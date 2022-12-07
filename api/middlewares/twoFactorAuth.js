const asyncHandler = require("./asyncHandler");

exports.otpAuth = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
});
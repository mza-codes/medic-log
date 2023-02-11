import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import genRes from "../utils/JSONResponse.js";
import asyncHandler from "./asyncHandler.js";

export const verifySuperAdmin = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req?.userId);
    console.log("Checking AdminStatus: ", user);

    if (!user) return next(new ErrorResponse("User not Found!", 400));
    if (user?.superAdmin === true) return next();
    
    return next(new ErrorResponse("Request Must be from SuperUser!", 403));
});
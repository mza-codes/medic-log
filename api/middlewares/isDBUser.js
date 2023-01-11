import User from "../models/User.js";
import genRes from "../utils/JSONResponse.js";
import asyncHandler from "./asyncHandler.js";

export const isDBUser = asyncHandler(async (req, res, next) => {
    const email = req?.body?.email;
    if (!email) return genRes(res, 400, false, "Email Must Be Provided on Request!");
    const dbUser = await User.findOne({ email });

    if (dbUser) {
        req.email = email;
        req.currentUser = dbUser;
        next();
    } else {
        return genRes(res, 404, false,
            `User With Email ${req?.body?.email} not found!`);
    };
});
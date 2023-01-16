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

export const verifyPwd = asyncHandler(async (req, res, next) => {
    const { currentPassword } = req?.body;
    if (!currentPassword) return genRes(res, 400, false, "Current Password not found on Request");
    const user = await User.findById(req.userId);
    const status = await user.comparePwd(currentPassword);
    if (status === true) {
        req.currentUser = user;
        return next();
    };
    return genRes(res, 401, false, "Current Password is Incorrect!");
});

export const chekUserStat = asyncHandler(async (req, res, next) => {
    const email = req?.body?.email;
    if (!email) return genRes(res, 400, false, "Email Must Be Provided on Request!");
    const dbUser = await User.findOne({ email });
    if (dbUser) {
        req.email = email;
        req.userStat = true;
        req.currentUser = dbUser;
    } else {
        req.userStat = false;
        req.email = email;
        req.currentUser = dbUser;
    };
    next();
});
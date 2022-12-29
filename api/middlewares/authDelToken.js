import jwt from "jsonwebtoken";
import { deleteReqCookie } from "../controllers/authControllers.js";
import asyncHandler from "./asyncHandler.js";

export const verifyDelToken = asyncHandler(async (req, res, next) => {
    const id = req?.params?.id;
    const delToken = req?.cookies?.[deleteReqCookie];
    if (!delToken) {
        return res.status(403).json({
            success: false,
            message: "UnAuthorized Request"
        });
    };

    const data = jwt.verify(delToken, process.env.JWT_REFRESH_KEY);
    if (id === data?.recordId) return next();
    else {
        return res.status(403).json({
            success: false,
            message: `Delete Request for Record ${id}, is not Authorized by Password!`
        });
    };
});
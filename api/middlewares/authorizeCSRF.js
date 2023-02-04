import { CSRFKey } from "../utils/authUtils.js";
import genRes from "../utils/JSONResponse.js";
import { redisClient } from "../utils/redisConfig.js";
import asyncHandler from "./asyncHandler.js";

export const verifyCSRF = asyncHandler(async (req, res, next) => {
    let token = req.headers?.authorization?.split(" ")?.[1] ??
        req.headers?.Authorization?.split(" ")?.[1] ?? false;
    let isValidReq = false;
    if (!token) return genRes(res, 403, false, "User Agent Mismatch!");
    [token, isValidReq] = token?.split("_T");
    const data = await redisClient.get(CSRFKey(req?.userId));
    console.log("CSRF: ",[token,isValidReq,data,req?.userId]);
    
    if (!isValidReq || !data || data !== token) return genRes(res, 401, false, "Request authorization failed!");
    if (data === token) return next();

    /** @param {failure_prevention} */
    return genRes(res, 401, false, "Request authorization failed!");
});
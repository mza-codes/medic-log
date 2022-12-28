import { log } from "../utils/logger.js";
import asyncHandler from "./asyncHandler.js";
const hexPattern = /[0-9a-fA-F]{24}/;

export const verifyHex = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const isHex = hexPattern.test(id);
    log.warn(id, "Validated to ", isHex);
    if (isHex) next();
    else {
        return res.status(415).json({
            success: false,
            message: `${id} does not match standards for Valid ID`
        });
    };
});
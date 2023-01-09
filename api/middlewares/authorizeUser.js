import { } from 'dotenv/config';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import asyncHandler from "./asyncHandler.js";
import {
    createAccessToken,
    createRefreshToken,
    userCookie,
    cookieConfig,
    refreshCookie,
}
    from '../controllers/authControllers.js';
import { log } from '../utils/logger.js';
import { redisClient } from '../utils/redisConfig.js';
import User from '../models/User.js';

export const tokenGenerator = (data) => {
    const newUserToken = createAccessToken(data);
    const newRefreshToken = createRefreshToken(data);
    return { newUserToken, newRefreshToken };
};

export const verifyTokens = async (key, value, field) => {
    let data = await redisClient.get(key);
    data = JSON.parse(data);
    return data?.[field] === value;
};

const hasCookie = (req, field) => {
    const token = req.cookies?.[field];
    if (!token) return false;
    else return token;
};

export const checkCookie = asyncHandler(async (req, res, next) => {
    // const token = req?.cookies[userCookie];
    const token = hasCookie(req, userCookie);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No session Information found on Request,Please Login!"
        });
    };
    let data = jwt.verify(token, process.env.JWT_KEY);
    if (!verifyTokens(data?.userId, token, "userToken")) {
        return res.status(401).json({
            success: false,
            message: "User session expired or not found,Please Login !"
        });
    };
    req.userId = data.userId;

    if (!data.userId) { // @ Failure prevention
        return res.status(500).json({
            success: false,
            message: `UserID not found in Token, Received ID:${req.userId}, Please Contact Vendor!`
        });
    };
    // req.refreshToken = token;
    log.info("COOKIE VERIFIED", req.userId);
    next();
});

export const checkRefreshCookie = asyncHandler(async (req, res, next) => {
    // const token = req?.cookies[refreshCookie];
    const token = hasCookie(req, refreshCookie);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No session Information found on Request,Please Login!"
        });
    };
    let data = jwt.verify(token, process.env.JWT_REFRESH_KEY);

    if (!verifyTokens(data?.userId, token, "refreshToken")) {
        return res.status(401).json({
            success: false,
            message: "User session expired or not found,Please Login !"
        });
    };
    log.info("REFRESH_COOKIE VERIFIED", req.userId);
    next();
});

export const checkValidity = async (req, res) => {
    log.warn("Checking Validity Via Cookie");
    const token = req?.cookies[userCookie];
    const refreshToken = req.cookies[refreshCookie];

    if (!token || !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "No session Information found on Request,Please Login!"
        });
    };
    let tokenData;
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Refresh Token Expired,Please Login!"
            });
        };
        tokenData = payload;
    });
    if (!verifyTokens(tokenData?.userId, token, "refreshToken")) {
        return res.status(401).json({
            success: false,
            message: "User session expired, Please Login !"
        });
    };

    try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.userId = data.userId;

        if (!verifyTokens(data?.userId, token, "userToken")) {
            return res.status(401).json({
                success: false,
                message: "User session expired, Please Login !"
            });
        };

        return res.status(200).json({
            success: true,
            message: "User Session is Active"
        });

    } catch (err) {
        if (err.name === "TokenExpiredError") {

            // const data = jwt.verify(token, process.env.JWT_KEY, { ignoreExpiration: true });
            const data = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            const { newUserToken, newRefreshToken } = tokenGenerator({ userId: data?.userId });
            const { exp } = jwt.verify(newUserToken, process.env.JWT_KEY);
            await redisClient.set(data?.userId, JSON.stringify({ userToken: newUserToken, refreshToken: newRefreshToken }));
            res.cookie(String(userCookie), newUserToken, {
                ...cookieConfig,
                expires: new Date(Date.now() + (1000 * 60) * (60 * 24))
            });
            res.cookie(String(refreshCookie), newRefreshToken, {
                ...cookieConfig,
                expires: new Date(Date.now() + (1000 * 60) * (60 * 24))
            });

            return res.status(200).json({ success: true, message: "User Session Refreshed", expiry: exp });
        };
        log.error("Request CheckValidity Error >", err);
        return res.status(400).json({ success: false, message: err?.message ?? "User Session Invalid!" });
    };
};

export const refreshSession = asyncHandler(async (req, res) => {
    const userToken = req.cookies[userCookie];
    const refreshToken = req.cookies[refreshCookie];
    if (!userToken || !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "No user session information found on request,Please Login!"
        });
    };

    const userData = jwt.verify(userToken, process.env.JWT_KEY, { ignoreExpiration: true });
    const refreshData = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, { ignoreExpiration: true });

    if (!verifyTokens(userData?.userId, userToken, "userToken") ||
        !verifyTokens(refreshData?.userId, refreshToken, "refreshToken")) {
        return res.status(401).json({
            success: false,
            message: "User session expired, Please Login !"
        });
    };

    const { newUserToken, newRefreshToken } = tokenGenerator({ userId: userData?.userId });
    const expiration = new Date(Date.now() + (1000 * 60) * (60 * 24));
    res.cookie(String(userCookie), newUserToken, {
        ...cookieConfig,
        expires: expiration
    });
    res.cookie(String(refreshCookie), newRefreshToken, {
        ...cookieConfig,
        expires: new Date(Date.now() + (1000 * 60) * (60 * 24))
    });
    await redisClient.set(userData?.userId, JSON.stringify({ userToken: newUserToken, refreshToken: newRefreshToken }));
    return res.status(200).json({ success: true, message: "User Session Updated!", expiry: expiration });
});

export const verifyPassword = asyncHandler(async (req, res, next) => {
    const password = req?.body?.password;
    console.log(password, req.body);

    if (!password) {
        return res.status(400).json({
            success: false,
            message: `Password Not Found on Request!`
        });
    };

    const userData = await User.findById(req.userId);
    const status = await bcrypt.compare(password, userData.password);
    if (status === true) {
        next();
    } else {
        return res.status(400).json({ success: false, message: "Incorrect Password!" });
    };
});

// ----------------------- //
// @unsused functions
export const provideRefreshToken = asyncHandler(async (req, res) => {
    log.warn("Refreshing token");
    const currentToken = req.body?.refreshToken;
    const currentUserToken = req.body?.userToken;

    if (4 === 3) { //overrides
        return res.status(401).json({
            success: false, message: "Invalid Refresh Token,Please Login to Continue"
        });
    };

    let data = jwt.verify(currentToken, process.env.JWT_REFRESH_KEY);
    const { newUserToken, newRefreshToken } = tokenGenerator({ userId: data?.userId });

    res.setHeader('user_token', newUserToken);
    return res.status(200).json({ success: true, refreshToken: newRefreshToken });
});

// @unused function
export const checkAuthorization = asyncHandler(async (req, res, next) => {
    log.warn("Checking Authorization");
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token || !userTokens.includes(token)) {
        return res.status(401).json({ success: false, message: "User token depreceated or not found !" });
    };

    let data = jwt.verify(token, process.env.JWT_KEY);
    req.userId = data.userId;
    // req.EXPIRY = data.exp;
    req.userToken = token;
    next();
});

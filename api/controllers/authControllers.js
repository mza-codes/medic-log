import { } from 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { verifiedCookie } from './twoFactorAuth.js';
import { log } from '../utils/logger.js';
import { redisClient } from '../utils/redisConfig.js';
import Patient from '../models/Patient.js';
import genRes from '../utils/JSONResponse.js';
import {
    userCookie,
    refreshCookie,
    deleteReqCookie,
    cookieConfig,
    createAccessToken,
    createRefreshToken,
} from '../utils/authUtils.js';

export const createAuth = asyncHandler(async (req, res) => {

    if (req?.email) {
        console.log("Duplicate USER: ", req.email);
        return genRes(res, 406, false, "User Already Exist!");
    };

    req.body.password = await bcrypt.hash(req.body?.password, 15);
    req.body.verified = false; //make it true using otpAuth
    const newUser = await User.create(req.body);
    const { password, ...other } = newUser._doc; // _doc is specified to get the actual JSON data

    const token = createAccessToken({ userId: other?._id });
    const { exp } = jwt.verify(token, process.env.JWT_KEY);
    const refreshToken = createRefreshToken({ userId: other?._id });
    // clear verified cookies
    res.clearCookie(verifiedCookie);
    req.cookies[verifiedCookie] = "";
    // add native cookies for better management
    res.setHeader('user_token', token);
    const cookieExpiration = new Date(Date.now() + (1000 * 60) * (60 * 24));

    // Sending Cookie
    res.cookie(String(userCookie), token, {
        ...cookieConfig,
        expires: cookieExpiration
    });
    res.cookie(String(refreshCookie), refreshToken, {
        ...cookieConfig,
        expires: cookieExpiration
        // expires: new Date(Date.now() + (1000 * 60) * 12) 
        // commenting -> expires default afer session
    });
    await redisClient.set(String(other._id), JSON.stringify({ userToken: token, refreshToken }));
    log.info("New User Created: ", newUser?.name);
    return res.status(200).json({ success: true, user: other, refreshToken: refreshToken, expiry: exp });
});

export const auth = asyncHandler(async (req, res, next) => {
    console.log("Authenticating... USER:",req.currentUser);
    const dbUser = req.currentUser;
    const stat = await dbUser.isValidPwd(req?.body?.password);
    if (stat === true) {
        const { password, ...other } = dbUser._doc; // _doc is specified to get the actual JSON data

        const token = createAccessToken({ userId: other?._id });
        const { exp } = jwt.verify(token, process.env.JWT_KEY);
        // Custom caching
        const refreshToken = createRefreshToken({ userId: other?._id });
        res.setHeader('user_token', token);
        const cookieExpiration = new Date(Date.now() + (1000 * 60) * (60 * 24));
        // Sending cookie
        res.cookie(String(userCookie), token, {
            ...cookieConfig,
            expires: cookieExpiration
        });
        res.cookie(String(refreshCookie), refreshToken, {
            ...cookieConfig,
            expires: cookieExpiration
            // expires: new Date(Date.now() + (1000 * 60) * 12) 
            // commenting -> expires default after session cookie
        });
        await redisClient.set(String(other._id), JSON.stringify({ userToken: token, refreshToken }));
        return res.status(200).json({ success: true, user: other, expiry: exp });
    } else {
        return res.status(401).json({ success: false, message: 'Incorrect Password' });
    };
});

export const provideUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId, "-password");
    if (!user) {
        return res.status(500).json({ // prevent failure
            success: false,
            message: `User with ID: ${req.userId} not Found in Database,Please Contact Vendor!`
        });
    };
    // await redisClient.set(String(req.userId), JSON.stringify({ userToken: req.userToken, refreshToken: req.refreshToken }));
    return res.status(200).json({ success: true, user: user, expiry: req.EXPIRY });
});

// Under Development
export const logout = asyncHandler(async (req, res) => {

    res.clearCookie(userCookie);
    res.clearCookie(refreshCookie);
    req.cookies[userCookie] = "";
    req.cookies[refreshCookie] = "";

    await redisClient.set(String(req.userId), JSON.stringify({ userToken: null, refreshToken: null }));

    return res.status(200).json({ success: true, message: "Logout Complete", user: {} });
});

export const genDelTokenByPwd = asyncHandler(async (req, res) => {
    const { body: { password }, params: { id } } = req;
    console.log(password, req.body, id);
    if (!password || !id) {
        return res.status(400).json({
            success: false,
            message: `${!password ? "Password Not Found on Request" : "Record ID Not Found"}`
        });
    };
    const record = await Patient.findById(id);

    if (!record || record?.owner !== req.userId) {
        let statusCode = !record ? 404 : 403;
        return res.status(statusCode).json({
            success: false,
            message: `${!record ? "Record with ID: " + id + " Not Found!"
                : "Only Record Owners are Authorized to Delete!"}`
        });
    };

    const userData = await User.findById(req.userId);
    const status = await bcrypt.compare(password, userData.password);
    if (status === true) {
        const token = jwt.sign({ recordId: id }, process.env.JWT_REFRESH_KEY, { expiresIn: "5m" });
        res.cookie(deleteReqCookie, token, {
            ...cookieConfig,
            expires: new Date(Date.now() + (1000 * 60) * 5)
        });
        return res.status(200).json({
            success: true,
            message: `Generated Delete Token!`
        });
    } else {
        return res.status(400).json({ success: false, message: "Incorrect Password!" });
    };
});

export const updateAuth = asyncHandler(async (req, res) => {
    console.log("REACHED updateAuth");
    console.log("req.id", req.userId);
    return res.status(200).json("Good");
});

export const removeAuth = asyncHandler(async (req, res) => {
    console.log("REACHED removeAuth route");
    console.log("req.id", req.userId);
    return res.status(200).json('removeAuth delete route');
});

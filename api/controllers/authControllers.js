import {} from 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { verifiedCookie } from './twoFactorAuth.js';
import { log } from '../utils/logger.js';
import { redisClient } from '../utils/redisConfig.js';

export const userCookie = "_ga_medic_log_sess";
export const refreshCookie = `_ga_medic_log_refresh`;
export const cookieConfig = {
    path: "/",
    expires: new Date(Date.now() + (1000 * 60) * 12),
    // expiry:
    httpOnly: true,
    sameSite: "lax"
};

export const createAccessToken = (data) => {
    const newToken = jwt.sign(data, process.env.JWT_KEY, { expiresIn: "1m" });
    return newToken;
};

export const createRefreshToken = (data) => {
    const newToken = jwt.sign(data, process.env.JWT_REFRESH_KEY, { expiresIn: "1d" });
    return newToken;
};

export const createAuth = asyncHandler(async (req, res) => {
    const duplicateUser = await User.findOne({ email: req.body.email });

    if (duplicateUser || duplicateUser !== null) {
        return res.status(406).json({ success: false, message: 'User Already Exists' });
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
        // expires: new Date(Date.now() + (1000 * 60) * 12) //  commenting expires default to session cookie
    });
    await redisClient.set(String(other._id), JSON.stringify({ userToken: token, refreshToken }));
    log.info("New User Created: ", newUser?.name);
    return res.status(200).json({ success: true, user: other, refreshToken: refreshToken, expiry: exp });
});

export const auth = asyncHandler(async (req, res, next) => {
    const dbUser = await User.findOne({ email: req.body.email });

    if (!dbUser || dbUser == null) {
        return res.status(404).json({ success: false, message: 'User Does not Exist' });
    };

    const stat = await bcrypt.compare(req.body.password, dbUser.password);
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
            // expires: new Date(Date.now() + (1000 * 60) * 12) //  commenting expires default to session cookie
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
    const refreshToken = req.cookies?.[refreshCookie];
    const accessToken = req?.cookies?.[userCookie];

    res.clearCookie(userCookie);
    res.clearCookie(refreshCookie);
    req.cookies[userCookie] = "";
    req.cookies[refreshCookie] = "";

    await redisClient.set(String(req.userId), JSON.stringify({ userToken: null, refreshToken: null }));

    return res.status(200).json({ success: true, message: "Logout Complete", user: {} });
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

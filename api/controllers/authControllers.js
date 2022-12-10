require('dotenv').config();

const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let { refreshTokens, userTokens } = require('../session/tokens');
const { verifiedCookie } = require('./twoFactorAuth');


exports.createAccessToken = ({ _id }) => {
    const newToken = jwt.sign({ userId: _id }, process.env.JWT_KEY ?? "m$auth", { expiresIn: "5m" });
    userTokens.push(newToken);
    return newToken;
};

exports.createRefreshToken = ({ _id }) => {
    const newToken = jwt.sign({ userId: _id }, process.env.JWT_REFRESH_KEY ?? "m$authRefresh", { expiresIn: "1d" });
    refreshTokens.push(newToken);
    return newToken;
};

exports.createAuth = asyncHandler(async (req, res, next) => {
    const duplicateUser = await User.findOne({ email: req.body.email });

    if (duplicateUser || duplicateUser !== null) {
        return res.status(406).json({ success: false, message: 'User Already Exists' });
    };

    req.body.password = await bcrypt.hash(req.body?.password, 15);
    req.body.verified = false; //make it true using otpAuth
    const newUser = await User.create(req.body);
    const { password, ...other } = newUser._doc; // _doc is specified to get the actual JSON data

    const token = this.createAccessToken(other);
    const refreshToken = this.createRefreshToken(other);
    // clear verified cookies
    res.clearCookie(verifiedCookie);
    req.cookies[verifiedCookie] = "";
    // add native cookies for better management
    
    res.setHeader('user_token', token);
    return res.status(200).json({ success: true, user: other, refreshToken: refreshToken });
});

exports.auth = asyncHandler(async (req, res, next) => {
    const dbUser = await User.findOne({ email: req.body.email });

    if (!dbUser || dbUser == null) {
        return res.status(404).json({ success: false, message: 'User Does not Exist' });
    };

    const stat = await bcrypt.compare(req.body.password, dbUser.password);
    if (stat === true) {
        const { password, ...other } = dbUser._doc; // _doc is specified to get the actual JSON data

        const token = this.createAccessToken(other);
        // Custom caching
        const refreshToken = this.createRefreshToken(other);
        res.setHeader('user_token', token);

        return res.status(200).json({ success: true, user: other, refreshToken: refreshToken });
    } else {
        return res.status(401).json({ success: false, message: 'Incorrect Password' });
    };
});

exports.logout = asyncHandler(async (req, res, next) => {
    console.log("Logout User");
    const currentRefreshToken = req.body.refreshToken;
    refreshTokens = refreshTokens.filter((item) => item !== currentRefreshToken);
    userTokens = userTokens.filter((item) => item !== req.userToken);
    return res.status(200).json({ success: true, message: "Logout Complete", user: {} });
});

exports.updateAuth = asyncHandler(async (req, res, next) => {
    console.log("REACHED updateAuth");
    console.log("req.id", req.userId);
    return res.status(200).json("Good");
});

exports.removeAuth = asyncHandler(async (req, res, next) => {
    console.log("REACHED removeAuth route");
    console.log("req.id", req.userId);
    return res.status(200).json('removeAuth delete route');
});
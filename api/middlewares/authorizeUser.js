require('dotenv').config();
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");
const { createAccessToken, createRefreshToken, userCookie, cookieConfig, refreshCookie } = require('../controllers/authControllers');
let { refreshTokens, userTokens } = require('../session/tokens');
const { log } = require('../utils/logger');

const handleTokenStorage = (removeToken, addToken, storageArray) => {
    if (!removeToken || !addToken || !storageArray) return false;

    storageArray = storageArray.filter((item) => item !== removeToken);
    storageArray.push(addToken);
    return true;
};

const tokenGenerator = (data) => {
    const newUserToken = createAccessToken(data);
    const newRefreshToken = createRefreshToken(data);
    return { newUserToken, newRefreshToken };
};

exports.checkAuthorization = asyncHandler(async (req, res, next) => {
    log.warn("Checking Authorization");
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token || !userTokens.includes(token)) {
        return res.status(401).json({ success: false, message: "User token depreceated or not found !" });
    };

    let data = jwt.verify(token, process.env.JWT_KEY ?? "m$auth");
    req.userId = data.userId;
    req.userToken = token;
    next();
});

exports.checkCookie = asyncHandler(async (req, res, next) => {
    log.warn("Checking Authorization Via Cookie");
    const token = req?.cookies[userCookie];

    if (!token || !userTokens.includes(token)) {
        return res.status(401).json({ success: false, message: "User token depreceated or not found,Please Login !" });
    };

    let data = jwt.verify(token, process.env.JWT_KEY ?? "m$auth");
    log.info("Cookie Decoded Data:", data);
    req.userId = data.userId;
    if (!data.userId) {
        // @ Failure prevention
        return res.status(500).json({
            success: false,
            message: `UserID not found in Token, Received ID:${req.userId}, Please Contact Vendor!`
        });
    };
    req.userToken = token;
    log.info("COOKIE VERIFIED", req.userId);
    next();
});

exports.provideRefreshToken = asyncHandler(async (req, res) => {
    log.warn("Refreshing token");
    const currentToken = req.body?.refreshToken;
    const currentUserToken = req.body?.userToken;

    if (!refreshTokens.includes(currentToken)) {
        return res.status(401).json({
            success: false, message: "Invalid Refresh Token,Please Login to Continue"
        });
    };

    let data = jwt.verify(currentToken, process.env.JWT_REFRESH_KEY);
    const { newUserToken, newRefreshToken } = tokenGenerator({ userId: data?.userId });
    // const newRefreshToken = createRefreshToken({ _id: data?.userId });

    handleTokenStorage(currentToken, newRefreshToken, refreshTokens);
    handleTokenStorage(currentUserToken, newUserToken, userTokens);
    // // Removing current refresh token from cache/Array
    // refreshTokens = refreshTokens.filter((item) => item !== currentToken);
    // refreshTokens.push(newRefreshToken);

    // // Removing current userToken
    // userTokens = userTokens.filter((item) => item !== currentUserToken);
    // userTokens.push(newUserToken);

    res.setHeader('user_token', newUserToken);
    return res.status(200).json({ success: true, refreshToken: newRefreshToken });
});

exports.checkValidity = async (req, res) => {
    log.warn("Checking Validity Via Cookie");
    const token = req?.cookies[userCookie];
    const refreshToken = req.cookies[refreshCookie];
    if (!token || !refreshToken ||
        !refreshTokens.includes(refreshToken) ||
        !userTokens.includes(token)
    ) {
        return res.status(401).json({ success: false, message: "User token depreceated or not found,Please Login !" });
    };

    let refreshValue;
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Refresh Token Expired,Please Login Again!" });
        };
        refreshValue = payload;
    });

    try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.userId = data.userId;
        return res.status(200).json({ success: true, message: "User Session is Active" });

    } catch (err) {
        if (err.name === "TokenExpiredError") {

            // const data = jwt.verify(token, process.env.JWT_KEY, { ignoreExpiration: true });
            const data = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            const { newUserToken, newRefreshToken } = tokenGenerator({ userId: data?.userId });

            handleTokenStorage(refreshToken, newRefreshToken, refreshTokens);
            handleTokenStorage(token, newUserToken, userTokens);

            res.cookie(String(userCookie), newUserToken, {
                ...cookieConfig,
                expires: new Date(Date.now() + (1000 * 60) * 14)
            });
            res.cookie(String(refreshCookie), newRefreshToken, {
                ...cookieConfig,
                expires: new Date(Date.now() + (1000 * 60) * 14)
            });
            return res.status(200).json({ success: true, message: "User Session Refreshed" });
        };
        log.error("Request CheckValidity Error >", err);
        return res.status(400).json({ success: false, message: err?.message ?? "User Session Invalid!" });
    };
};
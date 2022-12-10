// const { createClient } = require("redis");
const { log } = require("../utils/logger");

// const redisClient = createClient();

// redisClient.on('error', (err) => {
//     log.error('Error Connecting Redis: ', err);
//     return process.exit();
// });

// const connectRedis = async () => {
//     await redisClient.connect();
//     log.info("Redis Connection Success !");
//     return true;
// };

// const cacheData = async (key, data, cb) => {
//     await redisClient.lPush(key, JSON.stringify(data));
//     return true;
// };

let refreshTokens = [];
let userTokens = [];

module.exports = { refreshTokens, userTokens };
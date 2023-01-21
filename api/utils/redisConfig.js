// import { createClient } from "redis";
// import { log } from "../utils/logger.js";

// export const redisClient = createClient();

// redisClient.on('error', (err) => {
//     log.error('Error Connecting Redis: ', err);
//     return process.exit();
// });

// export const connectRedis = async () => {
//     await redisClient.connect();
//     log.info("Redis Connection Success !");
//     return true;
// };

// export const redisClient = new Map();

const cache = new Map();
class Client {
    set = async (key, val) => {
        cache.set(key, val);
    };

    get = async (key) => {
        return cache.get(key);
    };
};

export const redisClient = new Client();




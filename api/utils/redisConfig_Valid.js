import { createClient } from "redis";
import { log } from "./logger.js";

export const redisClient = createClient();

redisClient.on('error', (err) => {
    log.error('Error Connecting Redis: ', err);
    return process.exit();
});

export const connectRedis = async () => {
    await redisClient.connect();
    log.info("Redis Connection Success !");
    return true;
};

const cacheData = async (key, data, cb) => {
    await redisClient.lPush(key, JSON.stringify(data));
    return true;
};

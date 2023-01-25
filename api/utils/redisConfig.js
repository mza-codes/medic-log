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

// export const redisClient = new Map();



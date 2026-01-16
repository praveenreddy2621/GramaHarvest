const redis = require('../utils/redis');

const cache = (duration) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedBody = await redis.get(key);
            if (cachedBody) {
                return res.json(JSON.parse(cachedBody));
            } else {
                res.sendResponse = res.json;
                res.json = (body) => {
                    redis.set(key, JSON.stringify(body), 'EX', duration);
                    res.sendResponse(body);
                };
                next();
            }
        } catch (error) {
            console.error('Cache error:', error);
            next();
        }
    };
};

const clearCache = async (pattern) => {
    try {
        const keys = await redis.keys(`cache:${pattern}*`);
        if (keys.length > 0) {
            await redis.del(keys);
            console.log(`Cleared cache for pattern: ${pattern}`);
        }
    } catch (error) {
        console.error('Clear Cache error:', error);
    }
};

module.exports = { cache, clearCache };

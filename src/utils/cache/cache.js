const Redis = require('ioredis');
const redis = new Redis({ port: 6379, host: process.env.REDIS_HOST });

const defaultCacheTimeout = 1440; // 24 minutes

const getCache = async key => {
  return await redis.get(key);
};

const setCache = async (key, value, time = defaultCacheTimeout) => {
  value = JSON.stringify(value);
  return await redis.setex(key, time, value);
};

const updateCache = async (key, value, time = defaultCacheTimeout) => {
  const cacheResponse = await getCache(key);
  if (!cacheResponse) {
    return;
  }
  return await setCache(key, value, time);
};

const deleteCache = async key => {
  return await redis.del(JSON.stringify(key));
};

const cache = async (req, res, next) => {
  const { id } = req.params;
  const cacheResponse = await getCache(id);

  if (!cacheResponse) {
    return next();
  }

  return res
    .set('Content-Type', 'application/json')
    .status(200)
    .send(JSON.parse(cacheResponse));
};

module.exports = { cache, getCache, setCache, updateCache, deleteCache };

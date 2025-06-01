// redis.js
const IORedis = require("ioredis");
require("dotenv").config();

const redis = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

module.exports = redis;

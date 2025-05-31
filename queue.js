const { Queue } = require("bullmq");
const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue("email", {
  connection: redis,
});

module.exports = { emailQueue, redis }; // Export both

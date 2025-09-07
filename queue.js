const { Queue } = require("bullmq");
const redis = require("./redis");
require("dotenv").config();

const emailQueue = new Queue("email", {
  connection: redis,
});

module.exports = { emailQueue, redis }; // Export both

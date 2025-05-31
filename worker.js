const { Worker } = require("bullmq");
const Redis = require("ioredis");
const { sendEmail } = require("./mailer");
const { redis } = require("./queue");
require("dotenv").config();

const worker = new Worker(
  "emailQueue",
  async (job) => {
    try {
      console.log(`Processing job for ${job.data.to}`);
      await sendEmail(job.data);
      console.log("Email sent successfully");
    } catch (err) {
      console.error("Email send failed:", err.message);
      throw err;
    }
  },
  {
    connection: redis,
    attempts: null,
    backoff: { type: "exponential", delay: 5000 },
  }
);

// index.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const { Queue, Worker } = require("bullmq");
const redis = require("./redis");
const { sendEmail } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 3000;

// ----- Middleware -----
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));
app.use(morgan("combined"));
app.use(express.json({ limit: "10kb" }));

// ----- Email Queue -----
const emailQueue = new Queue("emailQueue", {
  connection: redis,
});

// ----- BullMQ Worker -----
const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, template, VERIFICATION_URL, name } = job.data;
    if (!to || !subject || !template || !VERIFICATION_URL || !name) {
      throw new Error("Missing required email fields in job data");
    }

    try {
      await sendEmail(to, subject, template, {
        VERIFICATION_URL,
        name,
      });
      console.log(`✅ Email sent to ${to}`);
    } catch (err) {
      console.error("❌ Email send failed:", err);
      throw err;
    }
  },
  {
    connection: redis,
    attempts: 5,
    backoff: { type: "exponential", delay: 5000 },
  }
);

// ----- Express Route -----
app.post("/send", async (req, res) => {
  const { to, subject, template, VERIFICATION_URL, name } = req.body;

  if (!to || !subject || !template || !VERIFICATION_URL || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await emailQueue.add("sendEmail", {
      to,
      subject,
      template,
      VERIFICATION_URL,
      name,
    });

    res.status(200).json({ message: "✅ Email job added to queue" });
  } catch (error) {
    console.error("❌ Failed to add job to queue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ----- Health Check -----
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ----- Global Error Handler -----
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// ----- Start Server -----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Email service running on port ${PORT}`);
});

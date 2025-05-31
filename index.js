const express = require("express");
const emailQueue = require("./queue");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/send", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await emailQueue.add("send_email", { to, subject, text });
    console.log(`Enqueued email job for: ${to}`);
    res.json({ message: "Email job queued" });
  } catch (error) {
    console.error("Error adding email job to queue:", error);
    res.status(500).json({ error: "Failed to queue email job" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

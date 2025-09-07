const axios = require("axios");

(async () => {
  try {
    const response = await axios.post(
      "https://transactional-email-worker.onrender.com/send",
      {
        to: "tanmaypatiltp25@gmail.com",
        subject: "Test Email",
        VERIFICATION_URL: "Verification email content",
        template: "verification",
        name: "Tanmay",
        // if you want to send extra template variables, make sure your API supports it
        // e.g. variables: { name: "Tanmay", VERIFICATION_URL: "https://www.google.com" }
      }
    );

    console.log("API response:", response.data);
  } catch (err) {
    console.error(
      "Error calling email API:",
      err.response?.data || err.message
    );
  }
})();

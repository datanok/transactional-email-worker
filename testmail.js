const axios = require("axios");

(async () => {
  try {
    const response = await axios.post("http://localhost:3001/send", {
      to: "tanmaypatiltp25@gmail.com",
      subject: "Test Email",
      text: "Verification email content",
      // if you want to send extra template variables, make sure your API supports it
      // e.g. variables: { name: "Tanmay", VERIFICATION_URL: "https://www.google.com" }
    });

    console.log("API response:", response.data);
  } catch (err) {
    console.error(
      "Error calling email API:",
      err.response?.data || err.message
    );
  }
})();

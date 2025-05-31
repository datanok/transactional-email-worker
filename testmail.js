const { sendEmail } = require("./mailer"); // or your sendEmail file

require("dotenv").config();

(async () => {
  try {
    await sendEmail("tanmaypatiltp25@gmail.com", "Test Email", "verification", {
      // variables to inject in template
      name: "Tanmay",
      VERIFICATION_URL: "https://www.google.com",
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Error sending email:", err);
  }
})();

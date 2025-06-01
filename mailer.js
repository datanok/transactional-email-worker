// mailer.js
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, templateName, variables = {}) {
  try {
    const templatePath = path.join(
      __dirname,
      "templates",
      `${templateName}.html`
    );

    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const html = template(variables);

    const msg = {
      to,
      from: process.env.FROM_EMAIL || "noreply@yourdomain.com",
      subject,
      html,
      text: `Please enable HTML to view this email. ${
        variables.VERIFICATION_URL || ""
      }`,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
    throw error;
  }
}

module.exports = { sendEmail };

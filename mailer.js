const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars"); // install with: npm install handlebars
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, templateName, variables) {
  // 1. Read your HTML template file (e.g., templates/welcome.html)
  const templatePath = path.join(
    __dirname,
    "templates",
    `${templateName}.html`
  );
  const source = fs.readFileSync(templatePath, "utf8");

  // 2. Compile template with Handlebars and inject variables
  const template = handlebars.compile(source);
  const html = template(variables);

  // 3. Prepare email message with html content
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html, // Use rendered HTML instead of plain text
    // Optionally, add text fallback:
    // text: variables.textFallback || '',
  };

  // 4. Send email using SendGrid
  await sgMail.send(msg);
}

module.exports = { sendEmail };

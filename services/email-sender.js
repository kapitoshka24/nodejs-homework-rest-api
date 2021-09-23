const sgMail = require("@sendgrid/mail");
require("dotenv").config();

class SenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({
      ...msg,
      from: "Natalia Byshovets <natashabysh@ex.ua>",
    });
  }
}

module.exports = { SenderSendGrid };

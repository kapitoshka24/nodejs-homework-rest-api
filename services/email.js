const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "https://efc3-194-107-179-216.ngrok.io";
        break;
      case "production":
        this.link = "link for production";
        break;
      default:
        this.link = "https://efc3-194-107-179-216.ngrok.io";
        break;
    }
  }
  #createTemplateVerificationEmail(verifyToken, name) {
    const mailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "hw №6 nodejs",
        link: this.link,
      },
    });
    const email = {
      body: {
        name,
        intro: "Welcome to nodejs-hw06!",
        action: {
          instructions: "To get started with nodejs-hw06, please click here:",
          button: {
            color: "#48cfad", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    };
    return mailGenerator.generate(email);
  }
  async sendAndVerifyEmail(verifyToken, email) {
    const emailHtml = this.#createTemplateVerificationEmail(verifyToken);
    const msg = {
      to: email,
      subject: "Verify your account",
      html: emailHtml,
    };
    await this.sender.send(msg);
  }
}

module.exports = EmailService;

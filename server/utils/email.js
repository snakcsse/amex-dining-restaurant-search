const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { convert } = require('html-to-text');
const mjml2html = require('mjml');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  // Create a transporter
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.SENDINBLUE_HOST,
        port: process.env.SENDINBLUE_PORT,
        auth: {
          user: process.env.SENDINBLUE_LOGIN,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }

    // this part is from mailtrap for development mode
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  generateHtml(template, variables) {
    let templatePath;
    if (template === 'welcome') {
      templatePath = path.join(__dirname, 'mjml-template/welcomeEmail.mjml');
    } else if (template === 'passwordReset') {
      templatePath = path.join(__dirname, 'mjml-template/passwordReset.mjml');
    }

    const mjmlTemplate = fs.readFileSync(templatePath, 'utf8');
    const htmlOutput = mjml2html(
      mjmlTemplate.replace('{{firstName}}', variables.firstName).replace('{{url}}', variables.url)
    ).html;

    return htmlOutput;
  }

  // Method for sending email using the created transporter
  async send(template, subject) {
    const html = this.generateHtml(template, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Amex Dining Search App');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Password reset (valid for only 10 minutes)');
  }
};

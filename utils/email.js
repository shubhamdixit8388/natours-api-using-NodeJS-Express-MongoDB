const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Shubham Dixit <${process.env.FROM_EMAIL}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
       // Sendgrid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send actual email
  async send(template, subject) {
    // 1. Render html based on pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2. Define email options
    const options = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    }

    // 3. create transport and send email
    await this.createTransport().sendMail(options);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to family');
  }

  async sendPasswordReset() {
    await this.send('password-reset', 'Your password reset token(Valid for 10 minutes only)');
  }
}

module.exports = Email;

// const sendMail = async (email, subject, message) => {
  // const transport = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });

  // const options = {
  //   from: `Shubham Dixit <${process.env.FROM_EMAIL}>`,
  //   to: email,
  //   subject,
  //   text: message,
  //   // html
  // }

  // await transport.sendMail(options);
// }

// module.exports = sendMail;

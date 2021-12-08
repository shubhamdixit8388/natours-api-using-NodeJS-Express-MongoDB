const nodemailer = require('nodemailer');

const sendMail = async (email, subject, message) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const options = {
    from: 'SVDIXIT <svdixit@gmail.com>',
    to: email,
    subject,
    text: message,
    // html
  }

  await transport.sendMail(options);
}

module.exports = sendMail;

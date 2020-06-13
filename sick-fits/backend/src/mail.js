const nodemailer = require('nodemailer');

exports.transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

exports.resetPasswordTemplate = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-file: 20px;
  ">
    <h2>Hello There!</h2>
    <p>${text}</p>

    <p>David Nuñez</p>
  </div>
`;

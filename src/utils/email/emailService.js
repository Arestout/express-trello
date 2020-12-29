const nodemailer = require('nodemailer');
const transporter = require('../../common/emailTransporter');
const { infoLogger } = require('../logger');

const sendAccountActivation = async (email, token) => {
  console.log({ email });
  const info = await transporter.sendMail({
    from: 'My App <info@my-app.com>',
    to: email,
    subject: 'Account Activation',
    html: `
    <div>
      <b>Please click below link to activate your account</b>
    </div>
    <div>
      <a href="http://localhost:4000/users/token?token=${token}">Activate</a>
    </div>
    `
  });
  infoLogger.info(`url: ${nodemailer.getTestMessageUrl(info)}`);
};

const sendPasswordReset = async (email, token) => {
  const info = await transporter.sendMail({
    from: 'My App <info@my-app.com>',
    to: email,
    subject: 'Password Reset',
    html: `
    <div>
      <b>Please click below link to reset your password</b>
    </div>
    <div>
      <a href="http://localhost:4000/#/password-reset?reset=${token}">Reset</a>
    </div>
    `
  });
  infoLogger.info(`url: ${nodemailer.getTestMessageUrl(info)}`);
};

module.exports = { sendAccountActivation, sendPasswordReset };

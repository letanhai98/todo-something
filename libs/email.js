import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.MAIL_DOMAIN,
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD || '123456',
  },
});

const initSendActivationCodeTemplate = (to, code) => {
  return {
    from: process.env.EMAIL_NAME,
    to,
    subject: 'Something-backend Activation Code',
    html: `<p style="font-size: 22px">Your code <b>${code}</b></p>`,
  };
};

const initForgotPasswordTemplate = (to, code) => ({
  from: process.env.EMAIL_NAME,
  to,
  subject: 'Something-backend Reset Password Code',
  html: `<p style="font-size: 22px">Your reset password code: <b>${code}</b></p>`,
});

const send = async (option) => {
  transporter.sendMail(option, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const sendActivateCode = async (to, code) => {
  const option = initSendActivationCodeTemplate(to, code);
  return send(option);
};

const sendResetPassword = async (to, password) => {
  const option = initForgotPasswordTemplate(to, password);
  return send(option);
};

export default { send, sendActivateCode, sendResetPassword };

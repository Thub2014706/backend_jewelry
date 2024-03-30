const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.PASSWORD_ACCOUNT,
    },
});

module.exports = {transporter}

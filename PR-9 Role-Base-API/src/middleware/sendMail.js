const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});

const sendMail = async (message) => {
    try {
        let resp = await transport.sendMail(message);
        return resp;
    } catch (err) {
        console.error('sendMail error', err);
        throw err;
    }
};

module.exports = sendMail;

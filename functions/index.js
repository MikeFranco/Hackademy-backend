const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { firebaseConfig } = require('firebase-functions');
const cors = require('cors')({
  origin: true
});

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: functions.config().mailer.email, // generated ethereal user
    pass: functions.config().mailer.password // generated ethereal password
  }
});

exports.emailMessage = functions.https.onRequest((req, res) => {
  const { email } = req.body;
  cors(req, res, () => {
    transporter.verify((error, success) => {
      error
        ? console.log('%cError verify', 'color: #807160', error)
        : console.log('verify passed', success);
    });
    // getting dest email by query string

    const mailOptions = {
      from: 'hola@hackademy.com', // Something like: Jane Doe <janedoe@gmail.com>
      to: email,
      subject: "I'M A PICKLE!!!", // email subject
      html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
              <br />
              <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
          ` // email content in HTML
    };

    // returning result
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.send(error.toString());
      }
      return res.send(info);
    });
  });
});

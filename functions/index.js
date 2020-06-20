const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cors = require('cors')({
  origin: true
});

admin.initializeApp();
let transporter;

nodemailer.createTestAccount((err, account) => {
  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });

  console.log('%c⧭', 'color: #1d5673', account.user);
  console.log('%c⧭', 'color: #f200e2', account.pass);
});

exports.emailMessage = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // getting dest email by query string
    const { name, email } = req.body;

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

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { firebaseConfig } = require('firebase-functions');
const cors = require('cors')({
  origin: true
});

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  auth: {
    user: functions.config().mailer.email,
    pass: functions.config().mailer.password
  }
});

exports.emailMessage = functions.https.onRequest((req, res) => {
  const { email } = req.body;

  cors(req, res, () => {
    transporter.verify((error, success) => {
      if (error) res.send(`Verify Error: ${error.toString()}`);
      else {
        const mailOptions = {
          from: 'hola@hackademy.com', //useless cause' use transporter.auth.user
          to: email,
          subject: "I'M A PICKLE!!!",
          html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
                    <br />
                    <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
                `
        };

        return transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.send(error.toString());
          }
          return res.send(info);
        });
      }
    });
  });
});

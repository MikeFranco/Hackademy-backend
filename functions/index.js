const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

/* const createTestAcc = async () => {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });
}; */

const testAccount = new Promise((resolve, reject) => {
  try {
    return nodemailer.createTestAccount((error, account) => {
      return error ? reject(error) : resolve(account);
    });
  } catch (error) {
    console.log('%cAlgo salío mal', 'color: #aa00ff', error);
    reject(error);
  }
});

const transporter = testAccount
  .then(response =>
    nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 465,
      secure: true,
      auth: {
        user: response.user,
        pass: response.pass
      }
    })
  )
  .catch(error => console.log('%cError transporter', 'color: #0088cc', error))

/* const transporter = nodemailer.createTestAccount((error, account) => {
  if (account) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 465,
      secure: true,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
  } else console.log('%cError en transporter', 'color: #00bf00', error);
}); */

exports.sendEmail = functions.firestore
  .document('prueba/{pruebaId}')
  .onCreate((snap, context) => {
    const mailOptions = {
      from: `hola@hackademy.com`,
      to: 'mfrancop.98@gmail.com',
      subject: 'contact form message',
      html: `<h1>Order Confirmation</h1>
     <p> <b>Email: </b>mfrancop.98@gmail.com</p>`
    };

    console.log('%ctransporter', 'color: #ffa640', transporter);

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log('%cHubo un error', 'color: #00e600', error);
        return;
      }
      console.log('%c⧭', 'color: #00a3cc', 'Sent!');

      console.log('%cData', 'color: #d90000', data);
    });
  });

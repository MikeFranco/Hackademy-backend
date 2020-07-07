const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { firebaseConfig } = require('firebase-functions');
const cors = require('cors')({
  origin: true
});

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: 'smtp.dreamhost.com',
  port: 465,
  secure: false,
  auth: {
    user: functions.config().hackademy.email,
    pass: functions.config().hackademy.password
  }
});

exports.emailMessage = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  const {
    name,
    email,
    cellphone,
    state,
    education,
    userName,
    language,
    afterClub,
    channel
  } = req.body;

  cors(req, res, () => {
    transporter.verify((error, success) => {
      if (error) res.send(`Verify Error: ${error.toString()}`);
      else {
        console.log('%c⧭', 'color: #006dcc', 'se pasa el transporter verify emailSend');
        const mailOptions = {
          from: 'hola@hackademy.com', //useless cause' use transporter.auth.user
          to: ['rodrigo.medina.neri@gmail.com', 'mfranco_98@yahoo.com'],
          subject: 'Nuevo Registro para el club de programación',
          html: `
            <p style="font-size: 16px;">Hola, aquí está la info:</p>
            <br />
            <ul>
              <li>Nombre: ${name}</li>
              <li>Email: ${email}</li>
              <li>Celular: ${cellphone}</li>
              <li>Ciudad y estado: ${state}</li>
              <li>Donde estudia y semestre: ${education}</li>
              <li>Usuario de gitHub: ${userName}</li>
              <li>Lenguaje a aplicar: ${language}</li>
              <li>¿Aplicará después del club?: ${afterClub}</li>
              <li>¿Cómo se enteró?: ${channel}</li>
            </ul>
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

exports.newsletter = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { email } = req.body;

  cors(req, res, () => {
    transporter.verify((error, success) => {
      if (error) res.send(`Verify Error: ${error.toString()}`);
      else {
        console.log('%c⧭', 'color: #006dcc', 'se pasa el transporter verify newsletter');
        const mailOptions = {
          from: 'hola@hackademy.com', //useless cause' use transporter.auth.user
          to: ['mfranco_98@yahoo.com', 'rodrigo.medina.neri@gmail.com'],
          subject: 'Nuevo Registro para el newsletter',
          html: ` 
            <p style="font-size: 20px;">Hola, este es el correo:</p>
            <br />
            <p style="font-size: 16px;">Email: ${email}</p>
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

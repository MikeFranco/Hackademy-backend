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
        const mailOptions = {
          from: 'hola@hackademy.com', //useless cause' use transporter.auth.user
          to: 'mfranco_98@yahoo.com',
          subject: "Nuevo Registro para el club de programación",
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

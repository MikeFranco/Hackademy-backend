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
  
  const mailOptions = {
    from: 'hola@hackademy.com', //useless cause' use transporter.auth.user
    to: 'comunidad@hackademy.mx',
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

  sendEmailFunction(req, res, mailOptions)
});

exports.newsletterFunction = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { email } = req.body;

  const mailOptions = {
    from: 'hola@hackademy.com', //useless cause' use transporter.auth.user
    to: 'hola@hackademy.mx',
    subject: 'Nuevo Registro para el newsletter',
    html: ` 
      <p style="font-size: 20px;">Hola, este es el correo:</p>
      <br />
      <p style="font-size: 16px;">Email: ${email}</p>
    `
  };

  sendEmailFunction(req, res, mailOptions);
});

exports.enterpriseContact = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { name, email, message } = req.body;
  const mailOptions = {
    from: 'hola@hackademy.com', //useless cause' use transporter.auth.user
    to: 'hola@hackademy.mx',
    subject: 'Nuevo contacto para empresa',
    html: `
    <p style="font-size: 16px;">Hola, aquí está la info:</p>
    <br />
    <ul>
      <li>Nombre: ${name}</li>
      <li>Email: ${email}</li>
      <li>Mensaje: ${message}</li>
    </ul>
  `
  };
  sendEmailFunction(req, res, mailOptions);
});

const sendEmailFunction = (req, res, mailOptions) => {
  cors(req, res, () => {
    transporter.verify((error, success) => {
      if (error) res.send(`Verify Error: ${error.toString()}`);
      else {
        return transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.send(error.toString());
          }
          return res.send(info);
        });
      }
    });
  });
}
require('dotenv').config();

const express = require('express');
const { Keypair, Transaction } = require('stellar-sdk');

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_SIGNING_KEY = process.env.SERVER_SIGNING_KEY;

function enableCors(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  next();
}

const app = express();

app.use(enableCors);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  '/.well-known',
  express.static('./static/well_known', {
    setHeaders: function (res, _) {
      res.set('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
      res.type('text/plain');
    }
  })
);

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port http://localhost:${SERVER_PORT}`);
});

// app.listen();

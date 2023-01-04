require('dotenv').config();

const express = require('express');
const { Keypair, Transaction, Networks } = require('stellar-sdk');

function enableCors(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const { PORT } = require('./config');

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

app.get('/auth', require('./hadlers/challange'));
app.post('/auth', require('./hadlers/token'));

app.listen(PORT);

// app.listen();

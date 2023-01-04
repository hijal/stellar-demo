const stellar = require('stellar-sdk');

const PORT = Number.parseInt(process.env.SERVER_PORT || '3000', 10);
const BIND = process.env.BIND || '0.0.0.0';
const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY;
const CHALLENGE_EXP = process.env.CHALLENGE_EXP;
const INVALID_SEQUENCE = '0';
const ENDPOINT = `http://localhost:${PORT}/auth`;
const JWT_TOKEN_EXP = process.env.JWT_TOKEN_EXP;
const JWT_SECRET = process.env.JWT_SECRET;

const ALLOWED_ACCOUNTS = (process.env.ALLOWED_ACCOUNTS || '').split(',');

const SERVER_KEY_PAIR = stellar.Keypair.fromSecret(SERVER_PRIVATE_KEY);
const HORIZON_URL = process.env.HORIZON_URL;

const STELLAR_SERVER = new stellar.Server(HORIZON_URL || 'https://horizon-testnet.stellar.org');

const NETWORK_PASSPHRASE = stellar.Networks[process.env.NETWORK_PASSPHRASE || 'TESTNET'];
const STELLAR_SERVER_FEE = process.env.STELLAR_SERVER_FEE || 100;

module.exports = {
  PORT,
  BIND,
  SERVER_KEY_PAIR,
  CHALLENGE_EXP,
  INVALID_SEQUENCE,
  ENDPOINT,
  JWT_SECRET,
  JWT_TOKEN_EXP,
  ALLOWED_ACCOUNTS,
  NETWORK_PASSPHRASE,
  STELLAR_SERVER_FEE
};

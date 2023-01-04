const crypto = require('crypto');
const Stellar = require('stellar-sdk');

const {
  SERVER_KEY_PAIR,
  CHALLENGE_EXP,
  INVALID_SEQUENCE,
  BIND,
  NETWORK_PASSPHRASE,
  STELLAR_SERVER_FEE
} = require('../config');

const account = new Stellar.Account(SERVER_KEY_PAIR.publicKey(), INVALID_SEQUENCE);

const randomNonce = () => crypto.randomBytes(32).toString('hex');

const challenge = async (req, res) => {
  const clientPublicKey = req.query.publicKey;

  const minTime = Date.now();
  const maxTime = minTime + CHALLENGE_EXP;
  const timebounds = {
    minTime: minTime.toString(),
    maxTime: maxTime.toString()
  };

  const opts = Stellar.Operation.manageData({
    source: clientPublicKey,
    name: `${BIND} auth`,
    value: randomNonce()
  });

  const tx_options = {
    fee: STELLAR_SERVER_FEE,
    timebounds,
    networkPassphrase: NETWORK_PASSPHRASE
  };
  const tx = new Stellar.TransactionBuilder(account, tx_options).addOperation(opts).build();
  tx.sign(SERVER_KEY_PAIR);
  res.json({ transaction: tx.toEnvelope().toXDR('base64'), network_passphrase: NETWORK_PASSPHRASE });
};

module.exports = challenge;

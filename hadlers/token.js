const { Transaction, Keypair } = require('stellar-sdk');

const { SERVER_KEY_PAIR, ENDPOINT, JWT_SECRET, JWT_TOKEN_EXP, ALLOWED_ACCOUNTS } = require('../config');

const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  const { transaction, network_passphrase } = req.body;

  if (!transaction) {
    return res.json({
      error: 'Transaction xdr is missing'
    });
  }

  if (!network_passphrase) {
    return res.json({
      error: 'Transaction networkpassphrase is missing'
    });
  }

  const tx = new Transaction(transaction, network_passphrase);
  if (!tx) {
    return res.json({
      error: 'Transaction or NetworkPassphrase is invalid'
    });
  }

  const op = tx.operations[0];
  const { signatures } = tx;
  const hash = tx.hash();

  if (tx.source !== SERVER_KEY_PAIR.publicKey()) {
    return res.json({
      error: 'Invalid source account'
    });
  }

  if (
    !signatures.some((signature) => {
      return SERVER_KEY_PAIR.verify(hash, signature.signature());
    })
  ) {
    return res.json({
      error: 'Invalid server signature or missing'
    });
  }

  if (
    !(
      tx.timeBounds &&
      Date.now() > Number.parseInt(tx.timeBounds.minTime, 10) &&
      Date.now() < Number.parseInt(tx.timeBounds.maxTime, 10)
    )
  ) {
    return res.json({
      error: 'Transaction challenge expired'
    });
  }

  if (op.type !== 'manageData') {
    return res.json({
      error: 'Challenge has no manageData operation'
    });
  }

  if (!op.source) {
    return res.json({
      error: 'Challenge has no source account'
    });
  }

  const clientPublicKey = Keypair.fromPublicKey(op.source);

  if (
    !signatures.some((signature) => {
      return clientPublicKey.verify(hash, signature.signature());
    })
  ) {
    return res.json({
      error: 'Client signature is missing or invalid'
    });
  }

  //   if (ALLOWED_ACCOUNTS.indexOf(op.source) === -1) {
  //     return res.json({
  //       error: `${op.source} access denied`
  //     });
  //   }

  const token = jwt.sign(
    {
      iss: ENDPOINT,
      sub: op.source,
      iat: Number(Math.floor(Date.now() / 1000)),
      exp: Number(Math.floor(Date.now() / 1000) + JWT_TOKEN_EXP),
      jwtid: tx.hash().toString('hex')
    },
    JWT_SECRET
  );
  res.json({ token });
};

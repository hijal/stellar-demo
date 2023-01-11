const { Keypair, Transaction, sign } = require('stellar-sdk');
const request = require('request');
const toml = require('toml');

const DOMAIN = 'http://localhost:3000';
const KEY = 'SA7H7336AHZ64D7QYVUP2NFW2KKOYV5V5FSA46MO7NO4V3RF3B2QBG7J';
const CLIENT_KEY_PAIR = Keypair.fromSecret(KEY);

request(`${DOMAIN}/.well-known/stellar.toml`, (err, res, body) => {
  if (err) {
    return console.log(err);
  }
  const config = toml.parse(body);
  const ENDPOINT = config.WEB_AUTH_ENDPOINT;
  const SERVER_KEY_PAIR = Keypair.fromPublicKey(config.WEB_AUTH_ACCOUNT);

  request(
    `${ENDPOINT}/?publicKey=${SERVER_KEY_PAIR.publicKey()}`,
    {
      json: true
    },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      const { transaction, network_passphrase } = body;
      const tx = new Transaction(transaction, network_passphrase);
      const { signatures } = tx;
      const hash = tx.hash();
      const valid = signatures.some((signature) =>
        SERVER_KEY_PAIR.verify(hash, signature.signature())
      );
      if (!valid) {
        return console.log('Server signature is not found');
      }
      tx.sign(CLIENT_KEY_PAIR);
      const singed = tx.toEnvelope().toXDR().toString('base64');

      request.post(
        {
          url: ENDPOINT,
          form: {
            transaction: singed,
            network_passphrase
          }
        },
        (err, res, body) => {
          console.log(err);
          console.log(body);
        }
      );
    }
  );
});

var crypto = require('crypto');

function PostgreSQLClientSecretStore(client) {
  this._client = client;
}

PostgreSQLClientSecretStore.prototype.verify = function(id, secret, cb) {
  this._client.query('SELECT * FROM client WHERE client_id = $1', [ id ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null, false); }
    
    // TODO: compare this with password hashing lib
    if (!crypto.timingSafeEqual(Buffer.from(row.hashed_secret), Buffer.from(secret))) {
      return cb(null, false, { message: 'Incorrect client ID or secret.' });
    }

    var client = {
      id: row.client_id,
      name: row.name
    };
    return cb(null, client);
  });
};

module.exports = PostgreSQLClientSecretStore;

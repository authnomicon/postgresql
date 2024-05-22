var crypto = require('crypto');

function PostgreSQLClientDirectory(client) {
  this._client = client;
}

PostgreSQLClientDirectory.prototype.read = function(id, cb) {
  this._client.query('SELECT * FROM clients WHERE client_id = $1', [ id ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
    var client = {
      id: row.client_id,
      name: row.name,
      redirectURIs: row.redirect_urls || []
    };
    // TODO: add this to the postgres schema
    if (row.web_origin) { client.webOrigins = [ row.web_origin ]; }
    
    return cb(null, client);
  });
}

module.exports = PostgreSQLClientDirectory;

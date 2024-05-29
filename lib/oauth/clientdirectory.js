var Client = require('../types/client');

var FIND_CLIENT_SQL =
'SELECT * \
   FROM clients \
  WHERE client_id = $1';


function PostgreSQLClientDirectory(client) {
  this._client = client;
}

PostgreSQLClientDirectory.prototype.read = function(id, cb) {
  this._client.query(FIND_CLIENT_SQL, [ id ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
    var obj = Client.fromClient(row);
    return cb(null, obj);
  });
}

module.exports = PostgreSQLClientDirectory;

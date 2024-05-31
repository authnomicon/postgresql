var User = require('./types/user');


function PostgreSQLUserDirectory(client) {
  this._client = client;
}

PostgreSQLUserDirectory.prototype.read = function(id, cb) {
  this._client.query('SELECT * FROM users WHERE user_id = $1', [ id ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
    var obj = User.fromRow(row);
    return cb(null, obj);
  });
}

PostgreSQLUserDirectory.prototype.create = function(user, cb) {
  // https://stackoverflow.com/questions/29333582/postgres-composite-type-on-node-postgres
  // https://www.postgresql.org/docs/current/rowtypes.html
  // https://www.postgresql.org/docs/current/arrays.html
  
  // TODO: are the arrays all escaped correctly?
  // possibly use this: https://www.npmjs.com/package/pg-array
  
  var row = this._toRow(user, true);
  var keys = Object.keys(row)
    , cols = []
    , params = []
    , vals = []
    , i, len;
  for (i = 0, len = keys.length; i < len; ++i) {
    cols.push(keys[i]);
    params.push('$' + (i + 1));
    vals.push(row[keys[i]])
  }
  
  this._client.query('INSERT INTO users (' + cols.join(', ') + ') VALUES (' + params.join(', ') + ') RETURNING *', vals, function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    
    var obj = User.fromRow(row);
    return cb(null, obj);
  });
}

PostgreSQLUserDirectory.prototype._toRow = function(user, isNew) {
  return User.toRow(user, isNew);
}

module.exports = PostgreSQLUserDirectory;

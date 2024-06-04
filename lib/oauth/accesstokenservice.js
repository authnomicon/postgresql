var crypto = require('crypto');

function PostgreSQLAccessTokenService(client) {
  this._client = client;
}

PostgreSQLAccessTokenService.prototype.issue = function(ctx, cb) {
  var self = this;
  
  crypto.randomBytes(64, function(err, buffer) {
    if (err) { return cb(err); }
    
    var token = buffer.toString('base64');
    
    var row = self._toRow(ctx, token);
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
    
    self._client.query('INSERT INTO access_tokens (' + cols.join(', ') + ') VALUES (' + params.join(', ') + ')', vals, function(err, res) {
      if (err) { return cb(err); }
      var row = res.rows[0];
      
      return cb(null, token);
    });
  });
}

PostgreSQLAccessTokenService.prototype.verify = function(token, cb) {
  var self = this;
  
  this._client.query('SELECT * FROM access_tokens WHERE token = $1', [ token ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null, false); }
    
    var ctx = self._fromRow(row);
    return cb(null, ctx);
  });
}

PostgreSQLAccessTokenService.prototype._fromRow = function(row) {
  var ctx = {};
  ctx.user = { id: row.user_id };
  ctx.client = { id: row.client_id };
  if (row.scope) { ctx.scope = row.scope };
  return ctx;
}

PostgreSQLAccessTokenService.prototype._toRow = function(ctx, token) {
  var row = {};
  row.user_id = ctx.user.id;
  row.client_id = ctx.client.id
  if (ctx.scope) { row.scope = ctx.scope }
  row.token = token;
  
  return row;
}

module.exports = PostgreSQLAccessTokenService;

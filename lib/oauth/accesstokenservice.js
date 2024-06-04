var crypto = require('crypto');

function PostgreSQLAccessTokenService(client) {
  this._client = client;
}

PostgreSQLAccessTokenService.prototype.issue = function(ctx, cb) {
  var self = this;
  
  crypto.randomBytes(64, function(err, token) {
    if (err) { return cb(err); }
    
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
      return cb(null, token.toString('base64'));
    });
  });
}

PostgreSQLAccessTokenService.prototype.verify = function(token, cb) {
  var self = this;
  
  var buffer = Buffer.from(token, 'base64');
  var hash = crypto.createHash('sha256').update(buffer).digest('base64');
  
  this._client.query('SELECT * FROM access_tokens WHERE token_hash = $1', [ hash ], function(err, res) {
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
  row.token_hash = crypto.createHash('sha256').update(token).digest('base64');
  row.user_id = ctx.user.id;
  row.client_id = ctx.client.id
  if (ctx.scope) { row.scope = ctx.scope }
  
  return row;
}

module.exports = PostgreSQLAccessTokenService;

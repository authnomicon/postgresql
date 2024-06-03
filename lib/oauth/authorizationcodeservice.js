var crypto = require('crypto');

function PostgreSQLAuthorizationCodeService(client) {
  this._client = client;
}

PostgreSQLAuthorizationCodeService.prototype.issue = function(ctx, cb) {
  var self = this;
  
  crypto.randomBytes(32, function(err, buffer) {
    if (err) { return cb(err); }
    
    var code = buffer.toString('base64');
    
    var row = self._toRow(ctx, code);
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
    
    self._client.query('INSERT INTO authorization_codes (' + cols.join(', ') + ') VALUES (' + params.join(', ') + ')', vals, function(err, res) {
      if (err) { return cb(err); }
      var row = res.rows[0];
      
      return cb(null, code);
    });
  });
}

PostgreSQLAuthorizationCodeService.prototype.verify = function(code, cb) {
  var self = this;
  
  this._client.query('SELECT * FROM authorization_codes WHERE code = $1', [ code ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null, false); }
    
    var ctx = self._fromRow(row);
    return cb(null, ctx);
  });
}

PostgreSQLAuthorizationCodeService.prototype._fromRow = function(row) {
  var ctx = {};
  ctx.issuer = row.issuer;
  ctx.client = { id: row.client_id };
  ctx.redirectURI = row.redirect_uri;
  ctx.user = { id: row.user_id };
  if (row.scope) { ctx.scope = row.scope };
  if (row.session_id) {
    ctx.authContext = {};
    ctx.authContext.sessionID = row.session_id;
  }
  return ctx;
}

PostgreSQLAuthorizationCodeService.prototype._toRow = function(ctx, code) {
  var row = {};
  row.issuer = ctx.issuer;
  row.client_id = ctx.client.id;
  row.redirect_uri = ctx.redirectURI;
  row.user_id = ctx.user.id;
  if (ctx.scope) { row.scope = ctx.scope }
  if (ctx.authContext && ctx.authContext.sessionID) { row.session_id = ctx.authContext.sessionID; }
  row.code = code;
  
  return row;
}

module.exports = PostgreSQLAuthorizationCodeService;

var uuid = require('uuidv7').uuidv7;
var Scope = require('../types/scope');


function PostgreSQLGrantService(client) {
  this._client = client;
}

PostgreSQLGrantService.prototype.create = function(grant, client, user, cb) {
  var self = this;
  var row = this._toRow(grant, client, user, true);
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
  
  this._client.query('INSERT INTO grants (' + cols.join(', ') + ') VALUES (' + params.join(', ') + ') RETURNING *', vals, function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    
    var grant = self._fromRow(row);
    return cb(null, grant);
  });
}

PostgreSQLGrantService.prototype.find = function(client, user, cb) {
  var self = this;
  
  this._client.query('SELECT * FROM grants WHERE user_id = $1 AND client_id = $2', [ user.id, client.id ], function(err, res) {
    if (err) { return cb(err); }
    
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
    var grant = self._fromRow(row);
    return cb(null, grant);
  });
}

PostgreSQLGrantService.prototype._fromRow = function(row) {
  var obj = {
    id: row.grant_id
  };
  obj.user = { id: row.user_id };
  obj.client = { id: row.client_id };
  if (row.scopes) { obj.scopes = Scope.fromScopeArray(row.scopes); };
  return obj;
}

PostgreSQLGrantService.prototype._toRow = function(grant, client, user, isNew) {
  var row = {};
  row.grant_id = isNew ? uuid() : grant.id;
  row.user_id = user.id;
  row.client_id = client.id;
  if (grant.scopes) { row.scopes = grant.scopes.map(Scope.toScope); }
  
  return row;
}

module.exports = PostgreSQLGrantService;

var uuid = require('uuidv7').uuidv7;
var User = require('./types/user');
var address = require('./types/address');
var plural = require('./types/plural');

var FIND_USER_SQL =
'SELECT * \
   FROM users \
  WHERE user_id = $1';

var INSERT_USER_SQL =
  'INSERT INTO users (user_id, family_name, given_name, middle_name, honorific_prefix, honorific_suffix, nickname, photos, urls, emails, phone_numbers, gender, addresses) \
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) \
RETURNING *';



function PostgreSQLUserDirectory(client) {
  this._client = client;
}

PostgreSQLUserDirectory.prototype.read = function(id, cb) {
  this._client.query(FIND_USER_SQL, [
    id
  ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
    var obj = User.fromUser(row);
    return cb(null, obj);
  });
}

PostgreSQLUserDirectory.prototype.create = function(user, cb) {
  // https://stackoverflow.com/questions/29333582/postgres-composite-type-on-node-postgres
  // https://www.postgresql.org/docs/current/rowtypes.html
  // https://www.postgresql.org/docs/current/arrays.html
  
  // TODO: are the arrays all escaped correctly?
  // possibly use this: https://www.npmjs.com/package/pg-array
  
  this._client.query(INSERT_USER_SQL, [
    uuid(),
    user.name && user.name.familyName,
    user.name && user.name.givenName,
    user.name && user.name.middleName,
    user.name && user.name.honorificPrefix,
    user.name && user.name.honorificSuffix,
    user.nickname,
    user.photos && user.photos.map(plural.toPlural),
    user.urls && user.urls.map(plural.toPlural),
    user.emails && user.emails.map(plural.toPlural),
    user.phoneNumbers && user.phoneNumbers.map(plural.toPlural),
    user.gender,
    user.addresses && user.addresses.map(address.toAddress)
  ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    
    var obj = User.fromUser(row);
    return cb(null, obj);
  });
}

module.exports = PostgreSQLUserDirectory;

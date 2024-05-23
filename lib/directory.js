var uuid = require('uuidv7').uuidv7;
var composite = require('./types/composite');
var array = require('postgres-array');
var types = require('pg-types');

function fromUser(row) {
  var obj = {
    id: row.user_id,
  };
  if (row.username) { obj.username = row.username; }
  if (row.family_name) { (obj.name = obj.name || {}).familyName = row.family_name; }
  if (row.given_name) { (obj.name = obj.name || {}).givenName = row.given_name; }
  if (row.middle_name) { (obj.name = obj.name || {}).middleName = row.middle_name; }
  if (row.honorific_prefix) { (obj.name = obj.name || {}).honorificPrefix = row.honorific_prefix; }
  if (row.honorific_suffix) { (obj.name = obj.name || {}).honorificSuffix = row.honorific_suffix; }
  if (row.nickname) { obj.nickname = row.nickname; }
  if (row.photos) {
    obj.photos = fromPlural(row.photos);
  }
  if (row.urls) {
    obj.urls = fromPlural(row.urls);
  }
  if (row.emails) {
    obj.emails = fromPlural(row.emails);
  }
  if (row.phone_numbers) {
    obj.phoneNumbers = fromPlural(row.phone_numbers);
  }
  if (row.gender) { obj.gender = row.gender; }
  // TODO: birthday
  // TODO: addresses
  // TODO: utcOffset
  // TODO: published
  // TODO: updated
  
  return obj;
}

function fromPlural(val) {
  return array.parse(val, composite([
    { name: 'value', oid: types.builtins.TEXT },
    { name: 'type', oid: types.builtins.TEXT },
    { name: 'is_primary', oid: types.builtins.BOOL },
    { name: 'is_verified', oid: types.builtins.BOOL }
  ])).map(function(e) {
    var o = {};
    if (e.value) { o.value = e.value; }
    if (e.type) { o.type = e.type; }
    if (e.is_primary !== undefined) { o.primary = e.is_primary; }
    if (e.is_verified !== undefined) { o.verified = e.is_verified; }
    return o;
  });
}

function toPlural(e) {
  return '(' + [ e.value, e.type, e.primary, e.verified ].join(',') + ')'
}



function PostgreSQLUserDirectory(client) {
  this._client = client;
}

/*
var READ_SQL = 
'SELECT \
  user_.*, \
  user_email.value AS email, \
  user_email.type AS email_type, \
  user_email.is_verified AS email_verified, \
  user_phone_number.value AS phone_number \
FROM user_ \
  LEFT JOIN user_email ON user_.user_id = user_email.user_id \
  LEFT JOIN user_phone_number ON user_.user_id = user_phone_number.user_id \
WHERE user_.user_id = $1';
*/

var READ_SQL = 
'SELECT * \
   FROM users \
  WHERE user_id = $1';

PostgreSQLUserDirectory.prototype.read = function(id, cb) {
  this._client.query(READ_SQL, [
    id
  ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
    var obj = fromUser(row);
    return cb(null, obj);
  });
}

var INSERT_USER_SQL =
  'INSERT INTO users (user_id, family_name, given_name, middle_name, honorific_prefix, honorific_suffix, nickname, emails, phone_numbers) \
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) \
RETURNING *';

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
    user.emails && user.emails.map(toPlural),
    user.phoneNumbers && user.phoneNumbers.map(toPlural)
  ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    
    var obj = fromUser(row);
    return cb(null, obj);
  });
}

module.exports = PostgreSQLUserDirectory;

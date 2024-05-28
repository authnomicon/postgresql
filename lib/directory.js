var uuid = require('uuidv7').uuidv7;
var composite = require('./types/composite');
var array = require('postgres-array');
var types = require('pg-types');

var FIND_USER_SQL =
'SELECT * \
   FROM users \
  WHERE user_id = $1';

var INSERT_USER_SQL =
  'INSERT INTO users (user_id, family_name, given_name, middle_name, honorific_prefix, honorific_suffix, nickname, photos, urls, emails, phone_numbers, gender, addresses) \
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) \
RETURNING *';


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
  if (row.addresses) {
    obj.addresses = fromAddress(row.addresses);
  }
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

function fromAddress(val) {
  return array.parse(val, composite([
    { name: 'street_address', oid: types.builtins.TEXT },
    { name: 'locality', oid: types.builtins.TEXT },
    { name: 'region', oid: types.builtins.TEXT },
    { name: 'postal_code', oid: types.builtins.TEXT },
    { name: 'country', oid: types.builtins.TEXT },
    { name: 'type', oid: types.builtins.TEXT },
    { name: 'is_primary', oid: types.builtins.BOOL },
    { name: 'is_verified', oid: types.builtins.BOOL }
  ])).map(function(e) {
    var o = {};
    if (e.street_address) { o.streetAddress = e.street_address; }
    if (e.locality) { o.locality = e.locality; }
    if (e.region) { o.region = e.region; }
    if (e.postal_code) { o.postalCode = e.postal_code; }
    if (e.country) { o.country = e.country; }
    if (e.type) { o.type = e.type; }
    if (e.is_primary !== undefined) { o.primary = e.is_primary; }
    if (e.is_verified !== undefined) { o.verified = e.is_verified; }
    return o;
  });
}

function toPlural(e) {
  return '(' + [ e.value, e.type, e.primary, e.verified ].join(',') + ')'
}

function toAddress(e) {
  return '(' + [ e.streetAddress, e.locality, e.region, e.postalCode, e.country, e.type, e.primary, e.verified ].join(',') + ')'
}



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
    
    var obj = fromUser(row);
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
    user.photos && user.photos.map(toPlural),
    user.urls && user.urls.map(toPlural),
    user.emails && user.emails.map(toPlural),
    user.phoneNumbers && user.phoneNumbers.map(toPlural),
    user.gender,
    user.addresses && user.addresses.map(toAddress)
  ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    
    var obj = fromUser(row);
    return cb(null, obj);
  });
}

module.exports = PostgreSQLUserDirectory;

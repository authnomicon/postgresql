var uuid = require('uuidv7').uuidv7;
var composite = require('./types/composite');
var array = require('postgres-array');
var types = require('pg-types');

function mapUser(row) {
  var obj = {
    id: row.user_id,
  };
  if (row.username) { obj.username = row.username; }
  if (row.family_name) { (obj.name = obj.name || {}).familyName = row.family_name; }
  if (row.given_name) { (obj.name = obj.name || {}).givenName = row.given_name; }
  if (row.middle_name) { (obj.name = obj.name || {}).middleName = row.middle_name; }
  if (row.honorific_prefix) { (obj.name = obj.name || {}).honorificPrefix = row.honorific_prefix; }
  if (row.honorific_suffix) { (obj.name = obj.name || {}).honorificSuffix = row.honorific_suffix; }
  
  if (row.emails) {
    obj.emails = array.parse(row.emails, composite([
      { name: 'address', oid: types.builtins.TEXT },
      { name: 'type', oid: types.builtins.TEXT },
      { name: 'is_primary', oid: types.builtins.BOOL },
      { name: 'is_verified', oid: types.builtins.BOOL }
    ])).map(function(e) {
      var o = {};
      if (e.address) { o.value = e.address; }
      if (e.type) { o.type = e.type; }
      if (e.is_primary !== undefined) { o.primary = e.is_primary; }
      if (e.is_verified !== undefined) { o.verified = e.is_verified; }
      return o;
    });
  }
  if (row.phone_numbers) {
    obj.phoneNumbers = array.parse(row.phone_numbers, composite([
      { name: 'number', oid: types.builtins.TEXT },
      { name: 'type', oid: types.builtins.TEXT },
      { name: 'is_primary', oid: types.builtins.BOOL },
      { name: 'is_verified', oid: types.builtins.BOOL }
    ])).map(function(e) {
      var o = {};
      if (e.number) { o.value = e.number; }
      if (e.type) { o.type = e.type; }
      if (e.is_primary) { o.primary = e.primary; }
      if (e.is_verified) { o.verified = e.verified; }
      return o;
    });
  }
  
  return obj;
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
    
    var obj = mapUser(row);
    return cb(null, obj);
  });
}

var INSERT_USER_SQL =
  'INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers) \
   VALUES ($1, $2, $3, $4, $5) \
RETURNING *';

PostgreSQLUserDirectory.prototype.create = function(user, cb) {
  console.log('CREATE')
  console.log(user);
  
  // https://stackoverflow.com/questions/29333582/postgres-composite-type-on-node-postgres
  // https://www.postgresql.org/docs/current/rowtypes.html
  // https://www.postgresql.org/docs/current/arrays.html
  
  // TODO: is this all escaped correctly?
  // possibly use this: https://www.npmjs.com/package/pg-array
  var emails = [ {value: 'foo@example.com', type: 'work', primary: true, verified: false}, { value: 'bar@example.com'} ].map(function(e) {
    return '(' + [ e.value, e.type, e.primary, e.verified ].join(',') + ')'
  })
  
  var phoneNumbers = [ {value: '1111'}, { value: '2222'} ].map(function(e) {
    return '(' + [ e.value, null, null, null ].join(',') + ')'
  })
  
  console.log(emails)
  //emails = emails.join(',')
  console.log(emails);
  
  // emails: '{"(foo@example.com,work,t,f)","(bar@example.com,,,)"}',
  //phone_numbers: '{"(1111,,,)","(2222,,,)"}',
  
  // [ '(foo@example.com,work,true,false)', '(bar@example.com,,,)' ]
// [ '(foo@example.com,work,true,false)', '(bar@example.com,,,)' ]
  // "(1111,,,)"
   //"(2222,,,)"
  
  this._client.query(INSERT_USER_SQL, [
    uuid(),
    user.name && user.name.familyName,
    user.name && user.name.givenName,
    //emails,
    user.emails && user.emails.map(function(e) {
      return '(' + [ e.value, e.type, e.primary, e.verified ].join(',') + ')'
    }),
    user.phoneNumbers && user.phoneNumbers.map(function(e) {
      return '(' + [ e.value, null, null, null ].join(',') + ')'
    })
    
    //phoneNumbers
  ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    
    console.log('CREATED!')
    console.log(row);
    //return
    
    var obj = mapUser(row);
    return cb(null, obj);
  });
}

module.exports = PostgreSQLUserDirectory;

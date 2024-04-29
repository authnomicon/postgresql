var uuid = require('uuidv7').uuidv7;

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
'SELECT \
  users.* \
FROM users \
WHERE users.user_id = $1';

PostgreSQLUserDirectory.prototype.read = function(id, cb) {
  console.log('READ');
  console.log(id);
  
  this._client.query(READ_SQL, [
      id
    ], function(err, res) {
      console.log(err);
      console.log(res);
      
      if (err) { return cb(err); }
      var row = res.rows[0];
      if (!row) { return cb(null); }
      
      var obj = {
        id: row.user_id,
        username: row.username,
        name: {
          familyName: row.family_name,
          givenName: row.given_name,
          middleName: row.middle_name,
          honorificPrefix: row.honorific_prefix,
          honorificSuffix: row.honorific_suffix
        }
      };
      
      console.log(row.emails);
      
      if (row.emails) {
        obj.emails = row.emails.map(function(e) {
          return {
            value: e.address,
            type: e.type,
            primary: e.is_primary,
            verified: e.is_verified
          }
        });
      }
      
      console.log(obj);
      
      return cb(null, obj);
    });
}

var INSERT_USER_SQL =
  'INSERT INTO users (user_id, family_name, given_name, emails) \
   VALUES ($1, $2, $3, $4) \
RETURNING *';

PostgreSQLUserDirectory.prototype.create = function(user, cb) {
  console.log('CREATE')
  console.log(user);
  
  // https://stackoverflow.com/questions/29333582/postgres-composite-type-on-node-postgres
  // https://www.postgresql.org/docs/current/rowtypes.html
  // https://www.postgresql.org/docs/current/arrays.html
  
  // TODO: is this all escaped correctly?
  // possibly use this: https://www.npmjs.com/package/pg-array
  var emails = [ {value: 'foo@example.com'}, { value: 'bar@example.com'} ].map(function(e) {
    return '(' + [ e.value, null, null, null ].join(',') + ')'
  })
  
  console.log(emails)
  //emails = emails.join(',')
  console.log(emails);
  
  
  this._client.query(INSERT_USER_SQL, [
      uuid(),
      user.name && user.name.familyName,
      user.name && user.name.givenName,
      emails
    ], function(err, res) {
      console.log(err);
      console.log(res);
      
      if (err) { return cb(err); }
      var row = res.rows[0];
      if (!row) { return cb(null); }
      
      var obj = {
        id: row.user_id,
        username: row.username,
        name: {
          familyName: row.family_name,
          givenName: row.given_name,
          middleName: row.middle_name,
          honorificPrefix: row.honorific_prefix,
          honorificSuffix: row.honorific_suffix
        }
      };
      
      // TODO: parse emails
      
      console.log(obj);
      
      return cb(null, obj);
      
      /*
      if (err) { return cb(err); }
      var row = res.rows[0];
      var obj = {
        id: row.user_id,
        username: row.username
      };
      return cb(null, obj);
      */
    });
}

module.exports = PostgreSQLUserDirectory;
